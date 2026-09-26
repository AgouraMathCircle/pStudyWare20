/*
================================================================================
  QA_Sanitize_ProdRestore.sql
  Masks PII in the QA database after the monthly PROD -> QA restore.

  Run this against the QA database ONLY, right after the restore and before
  the QA site or API is opened to testers.

  What it guarantees
  ------------------
  * All-or-nothing: the script runs as one batch in one transaction. If any
    statement fails, or the leftover-PII check at the end finds a real email
    still present, everything is rolled back and nothing is left half-masked.
  * The application keeps working:
      - The same fake email replaces a real email in EVERY table, so the links
        the app relies on still match. For example,
        MemberMaster.UserName/EmailID = AMC_tblUsers.coluserEmail, and the
        CreatedBy/PostedBy/ChangeBy audit columns hold usernames.
      - Primary keys, IDs, chapters, semesters, classes, scores, statuses and
        dates are not touched (date of birth is reduced to Jan 1 of the same year).
      - Every member's password is set to @QAPassword, so testers can log in
        as any role.
  * Fake logins stay the same from month to month:
        member  -> m<pMemberID>@amcqa.invalid
        parent  -> p<coluserID>@amcqa.invalid   (only if not already a member)
        student -> s<colStudentID>@amcqa.invalid
        other   -> c<n>@amcqa.invalid
    ".invalid" is a reserved top-level domain (RFC 2606) that can never
    receive mail, so QA cannot email a real family.

  Before running
  --------------
  1. Set @ExpectedDb and @QAPassword below.
  2. If PROD's schema has drifted from this repo, the batch fails to compile and
     nothing changes. Fix the column name and run it again.
================================================================================
*/
SET NOCOUNT ON;
SET XACT_ABORT ON;

------------------------------------------------------------------------------
-- Settings
------------------------------------------------------------------------------
DECLARE @ExpectedDb  sysname      = N'AMCQA';        -- safety guard: never run on PROD
DECLARE @QAPassword  varchar(50)  = 'ChangeMe#QA1';  -- the one QA login password; keep it out of source control
DECLARE @Domain      varchar(30)  = 'amcqa.invalid';

DECLARE @CurrentDb sysname = DB_NAME();
IF @CurrentDb <> @ExpectedDb
BEGIN
    RAISERROR('Aborted: connected to [%s], expected [%s]. This script must only run on QA.', 16, 1, @CurrentDb, @ExpectedDb);
    RETURN;
END;

IF @QAPassword IS NULL OR LEN(@QAPassword) < 8 OR @QAPassword = 'ChangeMe#QA1'
BEGIN
    RAISERROR('Aborted: set @QAPassword to a real QA password (8+ characters) before running.', 16, 1);
    RETURN;
END;

------------------------------------------------------------------------------
-- Fake name pools, chosen by ID so the result is the same every month
------------------------------------------------------------------------------
DECLARE @First TABLE (n int PRIMARY KEY, v varchar(20));
INSERT @First VALUES (0,'Alex'),(1,'Jordan'),(2,'Taylor'),(3,'Morgan'),(4,'Casey'),(5,'Riley'),
    (6,'Avery'),(7,'Quinn'),(8,'Jamie'),(9,'Rowan'),(10,'Parker'),(11,'Reese'),(12,'Skyler'),
    (13,'Dakota'),(14,'Emerson'),(15,'Finley'),(16,'Hayden'),(17,'Kendall'),(18,'Logan'),
    (19,'Micah'),(20,'Noel'),(21,'Peyton'),(22,'Sage'),(23,'Remy'),(24,'Shay');

DECLARE @Last TABLE (n int PRIMARY KEY, v varchar(20));
INSERT @Last VALUES (0,'Adams'),(1,'Brooks'),(2,'Carter'),(3,'Diaz'),(4,'Ellis'),(5,'Foster'),
    (6,'Garcia'),(7,'Hughes'),(8,'Ito'),(9,'Jensen'),(10,'Khan'),(11,'Lopez'),(12,'Mehta'),
    (13,'Nguyen'),(14,'Olsen'),(15,'Patel'),(16,'Quinn'),(17,'Reyes'),(18,'Singh'),
    (19,'Tanaka'),(20,'Usman'),(21,'Vargas'),(22,'Walsh'),(23,'Young'),(24,'Zhang');

------------------------------------------------------------------------------
-- Identity map: old email/username -> fake email (applied to every table)
------------------------------------------------------------------------------
IF OBJECT_ID('tempdb..#IdentityMap') IS NOT NULL DROP TABLE #IdentityMap;
CREATE TABLE #IdentityMap
(
    Seq      int IDENTITY(1,1) NOT NULL,
    OldKey   nvarchar(400) COLLATE DATABASE_DEFAULT NOT NULL PRIMARY KEY,
    NewEmail varchar(60)   COLLATE DATABASE_DEFAULT NULL
);

-- Every column that holds an email address or login username.
-- (Audit columns such as CreatedBy/PostedBy are found automatically further down.)
IF OBJECT_ID('tempdb..#EmailColumns') IS NOT NULL DROP TABLE #EmailColumns;
CREATE TABLE #EmailColumns (TableName sysname NOT NULL, ColumnName sysname NOT NULL, IsAudit bit NOT NULL DEFAULT 0);
INSERT #EmailColumns (TableName, ColumnName) VALUES
    ('MemberMaster','UserName'), ('MemberMaster','EmailID'),
    ('MemberMasterBackup','UserName'), ('MemberMasterBackup','EmailID'),
    ('AMC_tblUsers','coluserEmail'), ('AMC_tblUsers','colParentEmail'),
    ('AMC_tblStudents','colStudentEmail'), ('AMC_tblStudents_History','colStudentEmail'),
    ('AMC_ChapterMaster','ContactEmail'),                 -- SupportEmail is an org mailbox; it is kept
    ('AMC_MailMerger','EmailSendTo'),
    ('AMC_tblAccountReceivable','Email'),
    ('AMC_tblEmailTracking','SendTo'), ('AMC_tblEmailTracking','SendFrom'), ('AMC_tblEmailTracking','SendBy'),
    ('AMC_tblEnquiry','Email'), ('EC_tblEnquiry','Email'),
    ('AMC_tblMeetingSchedule','AdminLogin'),
    ('AMC_tblNewsltr','colEmail'),
    ('AMC_tblSpecialEventsRegistration','Email'),
    ('AMC_tblTestimonials','colTestEmail'),
    ('AMC_tblTriangularRegistration','Email'),
    ('AMC_tblUserNotificationToken','UserName'),
    ('AMC_tblUserTracking','UserName'),
    ('AMC_tblVolunteersRequest','Email'),
    ('Comments','EmailID');

-- Audit columns (CreatedBy, PostedBy, ...) in every table store usernames.
INSERT #EmailColumns (TableName, ColumnName, IsAudit)
SELECT t.name, c.name, 1
FROM sys.columns c
JOIN sys.tables t  ON t.object_id = c.object_id
JOIN sys.types  ty ON ty.user_type_id = c.user_type_id
WHERE SCHEMA_NAME(t.schema_id) = 'dbo'
  AND ty.name IN ('varchar','nvarchar','char','nchar')
  AND LOWER(c.name) IN ('createdby','changeby','updatedby','postedby','sendby','modfiedby','modifiedby','deleteby','insertedby');

DECLARE @sql nvarchar(max), @tbl sysname, @col sysname, @isAudit bit;
DECLARE @StartedTran bit = 0;

BEGIN TRY
    BEGIN TRANSACTION;
    SET @StartedTran = 1;

    ---------------------------------------------------------------------------
    -- 1. Build the identity map. Order matters: the member-based name wins,
    --    so a parent's username, member email and tblUsers email all map to
    --    the same m<ID> address.
    ---------------------------------------------------------------------------
    -- 1a. Members (these are the login accounts)
    ;WITH src AS (
        SELECT LOWER(LTRIM(RTRIM(UserName))) AS k, pMemberID FROM dbo.MemberMaster WHERE NULLIF(LTRIM(UserName),'') IS NOT NULL
        UNION ALL
        SELECT LOWER(LTRIM(RTRIM(EmailID))), pMemberID FROM dbo.MemberMaster WHERE NULLIF(LTRIM(EmailID),'') IS NOT NULL
    ), pick AS (
        SELECT k, pMemberID, ROW_NUMBER() OVER (PARTITION BY k ORDER BY pMemberID) AS rn FROM src
    )
    INSERT #IdentityMap (OldKey, NewEmail)
    SELECT k, 'm' + CAST(pMemberID AS varchar(10)) + '@' + @Domain FROM pick WHERE rn = 1;

    -- 1b. Parents/users who are not already mapped through MemberMaster
    ;WITH src AS (
        SELECT LOWER(LTRIM(RTRIM(coluserEmail))) AS k, coluserID FROM dbo.AMC_tblUsers WHERE NULLIF(LTRIM(coluserEmail),'') IS NOT NULL
        UNION ALL
        SELECT LOWER(LTRIM(RTRIM(colParentEmail))), coluserID FROM dbo.AMC_tblUsers WHERE NULLIF(LTRIM(colParentEmail),'') IS NOT NULL
    ), pick AS (
        SELECT k, coluserID, ROW_NUMBER() OVER (PARTITION BY k ORDER BY coluserID) AS rn FROM src
    )
    INSERT #IdentityMap (OldKey, NewEmail)
    SELECT k, 'p' + CAST(coluserID AS varchar(10)) + '@' + @Domain
    FROM pick WHERE rn = 1 AND NOT EXISTS (SELECT 1 FROM #IdentityMap m WHERE m.OldKey = pick.k);

    -- 1c. Student emails
    ;WITH pick AS (
        SELECT LOWER(LTRIM(RTRIM(colStudentEmail))) AS k, colStudentID,
               ROW_NUMBER() OVER (PARTITION BY LOWER(LTRIM(RTRIM(colStudentEmail))) ORDER BY colStudentID) AS rn
        FROM dbo.AMC_tblStudents WHERE NULLIF(LTRIM(colStudentEmail),'') IS NOT NULL
    )
    INSERT #IdentityMap (OldKey, NewEmail)
    SELECT k, 's' + CAST(colStudentID AS varchar(10)) + '@' + @Domain
    FROM pick WHERE rn = 1 AND NOT EXISTS (SELECT 1 FROM #IdentityMap m WHERE m.OldKey = pick.k);

    -- 1d. Any other email in the listed columns (enquiries, volunteer requests, ...).
    --     Audit columns only contribute values that look like emails; system values
    --     such as 'admin' or 'system' are left as they are.
    DECLARE colCur CURSOR LOCAL FAST_FORWARD FOR
        SELECT ec.TableName, ec.ColumnName, ec.IsAudit FROM #EmailColumns ec
        WHERE COL_LENGTH('dbo.' + ec.TableName, ec.ColumnName) IS NOT NULL;
    OPEN colCur;
    FETCH NEXT FROM colCur INTO @tbl, @col, @isAudit;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @sql = N'INSERT #IdentityMap (OldKey)
            SELECT DISTINCT LOWER(LTRIM(RTRIM(t.' + QUOTENAME(@col) + N'))) COLLATE DATABASE_DEFAULT
            FROM dbo.' + QUOTENAME(@tbl) + N' t
            WHERE NULLIF(LTRIM(t.' + QUOTENAME(@col) + N'),'''') IS NOT NULL'
            + CASE WHEN @isAudit = 1 THEN N' AND t.' + QUOTENAME(@col) + N' LIKE ''%@%''' ELSE N'' END + N'
              AND NOT EXISTS (SELECT 1 FROM #IdentityMap m
                              WHERE m.OldKey = LOWER(LTRIM(RTRIM(t.' + QUOTENAME(@col) + N'))) COLLATE DATABASE_DEFAULT);';
        EXEC sys.sp_executesql @sql;
        FETCH NEXT FROM colCur INTO @tbl, @col, @isAudit;
    END;
    CLOSE colCur; DEALLOCATE colCur;

    -- Values that are already fake (the script is being re-run) stay as they are
    DELETE FROM #IdentityMap WHERE OldKey LIKE '%@' + @Domain;

    UPDATE #IdentityMap SET NewEmail = 'c' + CAST(Seq AS varchar(10)) + '@' + @Domain WHERE NewEmail IS NULL;

    ---------------------------------------------------------------------------
    -- 2. Apply the map to every email, username and audit column
    ---------------------------------------------------------------------------
    DECLARE applyCur CURSOR LOCAL FAST_FORWARD FOR
        SELECT ec.TableName, ec.ColumnName FROM #EmailColumns ec
        WHERE COL_LENGTH('dbo.' + ec.TableName, ec.ColumnName) IS NOT NULL;
    OPEN applyCur;
    FETCH NEXT FROM applyCur INTO @tbl, @col;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @sql = N'UPDATE t SET ' + QUOTENAME(@col) + N' = m.NewEmail
            FROM dbo.' + QUOTENAME(@tbl) + N' t
            JOIN #IdentityMap m ON m.OldKey = LOWER(LTRIM(RTRIM(t.' + QUOTENAME(@col) + N'))) COLLATE DATABASE_DEFAULT;';
        EXEC sys.sp_executesql @sql;
        FETCH NEXT FROM applyCur INTO @tbl, @col;
    END;
    CLOSE applyCur; DEALLOCATE applyCur;

    ---------------------------------------------------------------------------
    -- 3. Mask names, phone numbers, addresses, secrets and free text
    ---------------------------------------------------------------------------
    -- Members (logins): names, one QA password, DOB kept to the year only
    UPDATE mm SET
        FirstName   = f.v,
        LastName    = l.v,
        [Password]  = @QAPassword,
        DateOfBirth = CASE WHEN mm.DateOfBirth IS NULL THEN NULL ELSE DATEFROMPARTS(YEAR(mm.DateOfBirth), 1, 1) END
    FROM dbo.MemberMaster mm
    JOIN @First f ON f.n = mm.pMemberID % 25
    JOIN @Last  l ON l.n = (mm.pMemberID * 7 + mm.pMemberID / 25) % 25;

    UPDATE mb SET
        FirstName   = f.v,
        LastName    = l.v,
        [Password]  = @QAPassword,
        DateOfBirth = CASE WHEN mb.DateOfBirth IS NULL THEN NULL ELSE DATEFROMPARTS(YEAR(mb.DateOfBirth), 1, 1) END
    FROM dbo.MemberMasterBackup mb
    JOIN @First f ON f.n = mb.pMemberID % 25
    JOIN @Last  l ON l.n = (mb.pMemberID * 7 + mb.pMemberID / 25) % 25;

    -- Parents/users: keep City/State/Country for reports; mask street, zip, phone
    UPDATE u SET
        coluserfName   = f.v,
        coluserlName   = l.v,
        coluserAddress = CASE WHEN u.coluserAddress IS NULL THEN NULL ELSE CAST(100 + u.coluserID % 9000 AS varchar(10)) + ' QA Test Street' END,
        coluserZip     = CASE WHEN u.coluserZip IS NULL THEN NULL ELSE '91301' END,
        coluserPhNo    = CASE WHEN u.coluserPhNo IS NULL THEN NULL ELSE '555-555-' + RIGHT('0000' + CAST(u.coluserID % 10000 AS varchar(10)), 4) END
    FROM dbo.AMC_tblUsers u
    JOIN @First f ON f.n = u.coluserID % 25
    JOIN @Last  l ON l.n = (u.coluserID * 7 + u.coluserID / 25) % 25;

    -- Students: names, school, typed signatures (the typed signatures are parents' names)
    UPDATE s SET
        colStudentFName    = f.v,
        colStudentLName    = l.v,
        colStudentSchool   = CASE WHEN s.colStudentSchool IS NULL THEN NULL ELSE 'QA School ' + CHAR(65 + s.colStudentID % 20) END,
        LiabilitySignature = CASE WHEN s.LiabilitySignature IS NULL THEN NULL ELSE 'QA Signature' END,
        RuleSignature      = CASE WHEN s.RuleSignature      IS NULL THEN NULL ELSE 'QA Signature' END
    FROM dbo.AMC_tblStudents s
    JOIN @First f ON f.n = (s.colStudentID + 7) % 25
    JOIN @Last  l ON l.n = (s.colStudentID * 7 + s.colStudentID / 25) % 25;

    UPDATE s SET
        colStudentFName    = f.v,
        colStudentLName    = l.v,
        colStudentSchool   = CASE WHEN s.colStudentSchool IS NULL THEN NULL ELSE 'QA School ' + CHAR(65 + s.colStudentID % 20) END,
        LiabilitySignature = CASE WHEN s.LiabilitySignature IS NULL THEN NULL ELSE 'QA Signature' END,
        RuleSignature      = CASE WHEN s.RuleSignature      IS NULL THEN NULL ELSE 'QA Signature' END
    FROM dbo.AMC_tblStudents_History s
    JOIN @First f ON f.n = (s.colStudentID + 7) % 25
    JOIN @Last  l ON l.n = (s.colStudentID * 7 + s.colStudentID / 25) % 25;

    -- Report card comments can name a child
    UPDATE dbo.AMC_tblReportCard     SET mComments = 'QA comment' WHERE NULLIF(LTRIM(mComments),'') IS NOT NULL;
    UPDATE dbo.AMC_tblReportCard_Bak SET mComments = 'QA comment' WHERE NULLIF(LTRIM(mComments),'') IS NOT NULL;

    -- Instructors
    UPDATE dbo.AMC_InstructorMaster
       SET ContactPhone = '555-555-' + RIGHT('0000' + CAST(InstructorID % 10000 AS varchar(10)), 4)
     WHERE ContactPhone IS NOT NULL;

    -- Chapters: the contact is a real person (ContactEmail is handled by the map)
    UPDATE dbo.AMC_ChapterMaster SET
        ContactPerson = 'QA Chapter Contact ' + CAST(ChapterID AS varchar(10)),
        ContactPhone  = '555-555-' + RIGHT('0000' + CAST(ChapterID AS varchar(10)), 4);

    -- Class email groups are real Google Groups of students and instructors: point them nowhere
    UPDATE dbo.AMC_ClassType SET
        StudentEmailGroup    = CASE WHEN StudentEmailGroup    IS NULL THEN NULL ELSE LOWER('qa-students-'    + RTRIM(Class) + ISNULL(RTRIM(Section),'') + '-' + ISNULL(CAST(ChapterID AS varchar(10)),'0') + '@' + @Domain) END,
        InstructorEmailGroup = CASE WHEN InstructorEmailGroup IS NULL THEN NULL ELSE LOWER('qa-instructors-' + RTRIM(Class) + ISNULL(RTRIM(Section),'') + '-' + ISNULL(CAST(ChapterID AS varchar(10)),'0') + '@' + @Domain) END;

    -- Mail merge queue: body and merge fields hold names and scores
    UPDATE dbo.AMC_MailMerger SET
        EmailBody  = 'QA: email body removed.',
        DataValue1 = CASE WHEN DataValue1 IS NULL THEN NULL ELSE 'QA' END,
        DataValue2 = CASE WHEN DataValue2 IS NULL THEN NULL ELSE 'QA' END,
        DataValue3 = CASE WHEN DataValue3 IS NULL THEN NULL ELSE 'QA' END,
        DataValue5 = CASE WHEN DataValue5 IS NULL THEN NULL ELSE 'QA' END,
        DataValue6 = CASE WHEN DataValue6 IS NULL THEN NULL ELSE 'QA' END;

    -- Finance: keep amounts, dates and types; mask who paid or was paid
    UPDATE dbo.AMC_tblAccountPayable SET
        PayableTo = 'QA Payee ' + CAST(ApID AS varchar(10)),
        Comments  = CASE WHEN NULLIF(LTRIM(Comments),'') IS NULL THEN Comments ELSE 'QA comment' END;
    UPDATE dbo.AMC_tblAccountReceivable SET
        [Name]    = 'QA Payer ' + CAST(ArID AS varchar(10)),
        Comments  = CASE WHEN NULLIF(LTRIM(Comments),'') IS NULL THEN Comments ELSE 'QA comment' END;

    UPDATE dbo.AMC_tblDonors SET DonorName = 'QA Donor ' + CAST(DonorID AS varchar(10));

    -- Sent-email log (Email Inbox): the message bodies contain names, and forgot-password emails contain passwords
    UPDATE dbo.AMC_tblEmailTracking SET
        [Subject] = 'QA email ' + CAST(ID AS varchar(10)),
        [Message] = N'QA: message body removed.';

    -- Enquiries, comments and testimonials: free text written by the public
    UPDATE dbo.AMC_tblEnquiry SET [Name] = 'QA Visitor ' + CAST(ID AS varchar(10)), [Message] = 'QA enquiry text.';
    UPDATE dbo.EC_tblEnquiry  SET [Name] = 'QA Visitor ' + CAST(ID AS varchar(10)), [Message] = 'QA enquiry text.';
    UPDATE dbo.Comments SET
        [Name]   = CASE WHEN [Name] IS NULL THEN NULL ELSE 'QA Visitor ' + CAST(pCommentID AS varchar(10)) END,
        Comments = CASE WHEN Comments IS NULL THEN NULL ELSE N'QA comment text.' END;
    UPDATE dbo.AMC_tblTestimonials SET
        colTestUser    = CASE WHEN colTestUser    IS NULL THEN NULL ELSE 'QA Parent ' + CAST(colTestID AS varchar(10)) END,
        colTestMessage = CASE WHEN colTestMessage IS NULL THEN NULL ELSE 'QA testimonial text ' + CAST(colTestID AS varchar(10)) + '.' END;

    -- Meeting links: remove passcodes and the embedded ?pwd= so QA cannot join live classes. MeetingID is kept.
    UPDATE dbo.AMC_tblMeetingSchedule SET
        Passcode      = CASE WHEN Passcode      IS NULL THEN NULL ELSE 'qa0000' END,
        AdminPassCode = CASE WHEN AdminPassCode IS NULL THEN NULL ELSE 'qa0000' END,
        MeetingURL    = CASE WHEN CHARINDEX('?', MeetingURL) > 0 THEN LEFT(MeetingURL, CHARINDEX('?', MeetingURL) - 1) ELSE MeetingURL END;

    -- Event and volunteer sign-ups (the public forms)
    UPDATE r SET
        FirstName = f.v,
        LastName  = CASE WHEN r.LastName IS NULL THEN NULL ELSE l.v END,
        School    = CASE WHEN r.School   IS NULL THEN NULL ELSE 'QA School ' + CHAR(65 + r.RequestID % 20) END,
        Phone     = CASE WHEN r.Phone    IS NULL THEN NULL ELSE '555-555-' + RIGHT('0000' + CAST(r.RequestID % 10000 AS varchar(10)), 4) END
    FROM dbo.AMC_tblSpecialEventsRegistration r
    JOIN @First f ON f.n = r.RequestID % 25
    JOIN @Last  l ON l.n = (r.RequestID * 7 + r.RequestID / 25) % 25;

    UPDATE r SET
        FirstName = f.v,
        LastName  = CASE WHEN r.LastName IS NULL THEN NULL ELSE l.v END,
        School    = CASE WHEN r.School   IS NULL THEN NULL ELSE 'QA School ' + CHAR(65 + r.RequestID % 20) END,
        Phone     = CASE WHEN r.Phone    IS NULL THEN NULL ELSE '555-555-' + RIGHT('0000' + CAST(r.RequestID % 10000 AS varchar(10)), 4) END,
        Comments  = CASE WHEN NULLIF(LTRIM(r.Comments),'') IS NULL THEN r.Comments ELSE 'QA comment' END
    FROM dbo.AMC_tblVolunteersRequest r
    JOIN @First f ON f.n = (r.RequestID + 3) % 25
    JOIN @Last  l ON l.n = (r.RequestID * 7 + r.RequestID / 25) % 25;

    UPDATE dbo.AMC_tblTriangularRegistration SET [Name] = 'QA Registrant ' + CAST(RowiID AS varchar(10)) WHERE [Name] IS NOT NULL;

    -- Login history: IP addresses
    UPDATE dbo.AMC_tblUserTracking SET IPAddress = '10.0.0.' + CAST(RowID % 250 + 1 AS varchar(5)) WHERE IPAddress IS NOT NULL;

    -- Push-notification device tokens reach real phones. The app registers a new token on next login.
    DELETE FROM dbo.AMC_tblUserNotificationToken;

    ---------------------------------------------------------------------------
    -- 4. Leftover check (gate): no original email or username may remain in any
    --    short text column. If one does, everything rolls back.
    ---------------------------------------------------------------------------
    IF OBJECT_ID('tempdb..#Leftover') IS NOT NULL DROP TABLE #Leftover;
    CREATE TABLE #Leftover (TableName sysname, ColumnName sysname, Hits int);

    DECLARE chkCur CURSOR LOCAL FAST_FORWARD FOR
        SELECT t.name, c.name
        FROM sys.columns c
        JOIN sys.tables t  ON t.object_id = c.object_id
        JOIN sys.types  ty ON ty.user_type_id = c.user_type_id
        WHERE SCHEMA_NAME(t.schema_id) = 'dbo'
          AND ty.name IN ('varchar','nvarchar','char','nchar')
          AND c.max_length BETWEEN 1 AND 800                        -- skip (max) columns; the free-text ones are overwritten above
          AND NOT (t.name = 'AMC_ChapterMaster' AND c.name = 'SupportEmail');   -- org mailbox, kept on purpose
    OPEN chkCur;
    FETCH NEXT FROM chkCur INTO @tbl, @col;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @sql = N'INSERT #Leftover SELECT @t, @c, COUNT(*)
            FROM dbo.' + QUOTENAME(@tbl) + N' x
            JOIN #IdentityMap m ON m.OldKey = LOWER(LTRIM(RTRIM(x.' + QUOTENAME(@col) + N'))) COLLATE DATABASE_DEFAULT
            HAVING COUNT(*) > 0;';
        EXEC sys.sp_executesql @sql, N'@t sysname, @c sysname', @t = @tbl, @c = @col;
        FETCH NEXT FROM chkCur INTO @tbl, @col;
    END;
    CLOSE chkCur; DEALLOCATE chkCur;

    IF EXISTS (SELECT 1 FROM #Leftover)
    BEGIN
        SELECT 'LEFTOVER PII - rolled back' AS Problem, * FROM #Leftover ORDER BY TableName, ColumnName;
        RAISERROR('Leftover-PII check failed: original emails or usernames remain in the columns listed above. Add those columns to #EmailColumns and run again.', 16, 1);
    END;

    COMMIT TRANSACTION;
    SET @StartedTran = 0;
    PRINT 'QA sanitization committed.';
END TRY
BEGIN CATCH
    IF @StartedTran = 1 AND @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    DECLARE @err nvarchar(4000) = ERROR_MESSAGE();
    RAISERROR('QA sanitization FAILED and was rolled back: %s', 16, 1, @err);
    RETURN;
END CATCH;

------------------------------------------------------------------------------
-- 5. Report: what changed, and QA logins for each role (all use @QAPassword)
------------------------------------------------------------------------------
SELECT COUNT(*) AS IdentitiesMasked FROM #IdentityMap;

-- Listed email columns that do not exist in this DB (schema drift: check if they were renamed)
SELECT 'Expected column missing - review' AS [Check], ec.TableName, ec.ColumnName
FROM #EmailColumns ec
WHERE ec.IsAudit = 0 AND COL_LENGTH('dbo.' + ec.TableName, ec.ColumnName) IS NULL;

;WITH r AS (
    SELECT MemberType, systemAdmin, ChapterID, UserName, pMemberID,
           ROW_NUMBER() OVER (PARTITION BY MemberType, ISNULL(systemAdmin,'N') ORDER BY pMemberID) AS rn
    FROM dbo.MemberMaster
    WHERE ISNULL(Approved,0) = 1 AND ISNULL(Active,1) = 1
)
SELECT MemberType, systemAdmin, ChapterID, pMemberID, UserName AS QALogin
FROM r WHERE rn <= 3
ORDER BY MemberType, systemAdmin, pMemberID;

DROP TABLE #IdentityMap;
DROP TABLE #EmailColumns;
DROP TABLE #Leftover;
