USE [AMCQA]
GO

/*
Fix: AMC_spSelectStudentWaitingList duplicate rows (join fan-out)

Root cause:
- AMC_tblStudents joins AMC_ClassMaster (1-to-many) in multiple places.
- #DuplicateCheck can contain multiple rows per StudentID.
- Final select joins TS+CM+DC again, multiplying rows.

Approach:
- Build one-row-per-student sets using OUTER APPLY TOP (1) from AMC_ClassMaster.
- Keep duplicate-check behavior (NEW / Duplicate:<ExistingID>) but dedupe source sets.
- Return one row per StudentID in both @WaitingForOnSite branches.
*/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[AMC_spSelectStudentWaitingList]
    @WaitingForOnSite CHAR(1) = 'N',
    @UserName VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    CREATE TABLE #DuplicateCheck
    (
        StudentID INT PRIMARY KEY,
        colStudentFName VARCHAR(50),
        colStudentLName VARCHAR(50),
        coluserEmail VARCHAR(100),
        Class CHAR(2),
        ApplicationStatus VARCHAR(20) DEFAULT 'NEW',
        ExistingID INT NULL
    );

    ;WITH WaitingStudents AS
    (
        SELECT
            TS.colStudentID AS StudentID,
            TS.colStudentFName,
            TS.colStudentLName,
            TU.coluserEmail,
            C1.Class
        FROM dbo.AMC_tblUsers TU WITH (NOLOCK)
        INNER JOIN dbo.AMC_tblStudents TS WITH (NOLOCK)
            ON TU.coluserID = TS.colParentID
        INNER JOIN dbo.MemberMaster MM WITH (NOLOCK)
            ON UPPER(LTRIM(MM.Username)) = UPPER(LTRIM(TU.coluserEmail))
        INNER JOIN dbo.AMC_ChapterMaster CH WITH (NOLOCK)
            ON CH.ChapterID = TS.ChapterID
        OUTER APPLY
        (
            SELECT TOP (1) CM.Class
            FROM dbo.AMC_ClassMaster CM WITH (NOLOCK)
            WHERE CM.StudentID = TS.colStudentID
            ORDER BY CM.Class
        ) C1
        WHERE TS.colStatus = 'W'
          AND TS.ChapterID IN (SELECT ChapterID FROM dbo.GettingAuthorizedChapter(@UserName))
    ),
    WaitingStudentsRanked AS
    (
        SELECT
            StudentID,
            colStudentFName,
            colStudentLName,
            coluserEmail,
            Class,
            ROW_NUMBER() OVER (
                PARTITION BY StudentID
                ORDER BY
                    CASE WHEN Class IS NULL OR LTRIM(RTRIM(Class)) = '' THEN 1 ELSE 0 END,
                    Class
            ) AS rn
        FROM WaitingStudents
    ),
    WaitingStudentsDedup AS
    (
        SELECT
            StudentID,
            colStudentFName,
            colStudentLName,
            coluserEmail,
            Class
        FROM WaitingStudentsRanked
        WHERE rn = 1
    ),
    RegisteredStudents AS
    (
        SELECT DISTINCT
            TS.colStudentID AS ExistingID,
            TS.colStudentFName,
            TS.colStudentLName,
            TU.coluserEmail,
            C1.Class
        FROM dbo.AMC_tblUsers TU WITH (NOLOCK)
        INNER JOIN dbo.AMC_tblStudents TS WITH (NOLOCK)
            ON TU.coluserID = TS.colParentID
        INNER JOIN dbo.MemberMaster MM WITH (NOLOCK)
            ON UPPER(LTRIM(MM.Username)) = UPPER(LTRIM(TU.coluserEmail))
        INNER JOIN dbo.AMC_ChapterMaster CH WITH (NOLOCK)
            ON CH.ChapterID = TS.ChapterID
        OUTER APPLY
        (
            SELECT TOP (1) CM.Class
            FROM dbo.AMC_ClassMaster CM WITH (NOLOCK)
            WHERE CM.StudentID = TS.colStudentID
            ORDER BY CM.Class
        ) C1
        WHERE TS.colStatus = 'R'
          AND TS.ChapterID IN (SELECT ChapterID FROM dbo.GettingAuthorizedChapter(@UserName))
    )
    INSERT INTO #DuplicateCheck (StudentID, colStudentFName, colStudentLName, coluserEmail, Class)
    SELECT StudentID, colStudentFName, colStudentLName, coluserEmail, Class
    FROM WaitingStudentsDedup;

    UPDATE DC
        SET ExistingID = X.ExistingID,
            ApplicationStatus = 'Duplicate:' + CAST(X.ExistingID AS VARCHAR(8))
    FROM #DuplicateCheck DC
    INNER JOIN
    (
        SELECT
            W.StudentID AS CurrentID,
            MIN(R.ExistingID) AS ExistingID
        FROM WaitingStudentsDedup W
        INNER JOIN RegisteredStudents R
            ON LOWER(LTRIM(W.colStudentFName)) = LOWER(LTRIM(R.colStudentFName))
           AND LOWER(LTRIM(W.colStudentLName)) = LOWER(LTRIM(R.colStudentLName))
           AND ISNULL(W.Class, '') = ISNULL(R.Class, '')
           AND LOWER(LTRIM(W.coluserEmail)) = LOWER(LTRIM(R.coluserEmail))
        GROUP BY W.StudentID
    ) X
        ON X.CurrentID = DC.StudentID;

    IF @WaitingForOnSite = 'Y'
    BEGIN
        ;WITH OnSiteWaiting AS
        (
            SELECT
                TS.colStudentID AS StudentID,
                TS.colStudentFName + ' ' + TS.colStudentLName AS StudentName,
                TS.colStudentEmail AS StudentEmail,
                TS.colStudentSchool AS School,
                TS.colStudentGrade AS Grade,
                TU.coluserfName + ' ' + TU.coluserlName AS ParentName,
                TU.coluserCity AS City,
                TU.coluserState AS State,
                TU.coluserCountry AS Country,
                TU.coluserPhNo AS PhoneNumber,
                TU.coluserEmail AS EmailAddress,
                TS.colStudentEnrolledSession AS EventSession,
                C1.Class AS ClassCode,
                CH.Name AS EventLocation,
                TU.RegisteredDate AS RegisteredDate,
                TS.colStudentFName + 'E$~#' + TS.colStudentLName + 'E$~#' + ISNULL(C1.Class, '') + 'E$~#' +
                TU.coluserEmail + 'E$~#' + TS.colStudentEnrolledSession + 'E$~#' + TS.colStudentGrade + 'E$~#' +
                TS.ColEventLocation + 'E$~#' + CAST(CH.ChapterID AS VARCHAR(10)) + 'E$~#' + MM.Password AS StudentClassInfo,
                MM.Password
            FROM dbo.AMC_tblUsers TU WITH (NOLOCK)
            INNER JOIN dbo.AMC_tblStudents TS WITH (NOLOCK)
                ON TU.coluserID = TS.colParentID
            INNER JOIN dbo.MemberMaster MM WITH (NOLOCK)
                ON UPPER(LTRIM(MM.Username)) = UPPER(LTRIM(TU.coluserEmail))
            INNER JOIN dbo.AMC_ChapterMaster CH WITH (NOLOCK)
                ON CH.ChapterID = TS.ChapterID
            OUTER APPLY
            (
                SELECT TOP (1) CM.Class
                FROM dbo.AMC_ClassMaster CM WITH (NOLOCK)
                WHERE CM.StudentID = TS.colStudentID
                ORDER BY CM.Class
            ) C1
            WHERE TS.RequestedLocation = 'O'
              AND TS.ColEventLocation = 'I'
              AND TS.ChapterID IN (SELECT ChapterID FROM dbo.GettingAuthorizedChapter(@UserName))
        )
        SELECT DISTINCT
            StudentID,
            StudentName,
            StudentEmail,
            School,
            Grade,
            ParentName,
            City,
            State,
            Country,
            PhoneNumber,
            EmailAddress,
            EventSession,
            Class =
                CASE
                    WHEN ClassCode = 'DS' THEN 'Data Science'
                    WHEN ClassCode = 'AI' THEN 'Artificial Intelligence'
                    WHEN ClassCode = 'GD' THEN 'Game Development'
                    WHEN ClassCode = 'AD' THEN 'App Development'
                    WHEN ClassCode = 'DM' THEN 'Data Management'
                    WHEN ClassCode = 'ED' THEN 'Engineering Design'
                    WHEN ClassCode = 'ST' THEN 'PSAT'
                    WHEN ClassCode = 'AT' THEN 'ACT'
                    WHEN ClassCode = 'JB' THEN 'Junior Beginner'
                    WHEN ClassCode = 'JI' THEN 'Junior Intermediate'
                    WHEN ClassCode = 'JA' THEN 'Junior Advanced'
                    WHEN ClassCode = 'SB' THEN 'Senior Beginner'
                    WHEN ClassCode = 'SA' THEN 'Senior Advanced'
                END,
            EventLocation,
            RegisteredDate,
            StudentClassInfo,
            Password,
            ApplicationStatus = 'Existing'
        FROM OnSiteWaiting
        ORDER BY ApplicationStatus DESC, StudentID DESC;
    END
    ELSE
    BEGIN
        ;WITH WaitingBase AS
        (
            SELECT
                TS.colStudentID AS StudentID,
                TS.colStudentFName + ' ' + TS.colStudentLName AS StudentName,
                TS.colStudentEmail AS StudentEmail,
                TS.colStudentSchool AS School,
                TS.colStudentGrade AS Grade,
                TU.coluserfName + ' ' + TU.coluserlName AS ParentName,
                TU.coluserCity AS City,
                TU.coluserState AS State,
                TU.coluserCountry AS Country,
                TU.coluserPhNo AS PhoneNumber,
                TU.coluserEmail AS EmailAddress,
                TS.colStudentEnrolledSession AS EventSession,
                C1.Class AS ClassCode,
                CH.Name AS EventLocation,
                TU.RegisteredDate AS RegisteredDate,
                TS.colStudentFName + 'E$~#' + TS.colStudentLName + 'E$~#' + ISNULL(C1.Class, '') + 'E$~#' +
                TU.coluserEmail + 'E$~#' + TS.colStudentEnrolledSession + 'E$~#' + TS.colStudentGrade + 'E$~#' +
                TS.ColEventLocation + 'E$~#' + CAST(CH.ChapterID AS VARCHAR(10)) + 'E$~#' + MM.Password AS StudentClassInfo,
                MM.Password
            FROM dbo.AMC_tblUsers TU WITH (NOLOCK)
            INNER JOIN dbo.AMC_tblStudents TS WITH (NOLOCK)
                ON TU.coluserID = TS.colParentID
            INNER JOIN dbo.MemberMaster MM WITH (NOLOCK)
                ON UPPER(LTRIM(MM.Username)) = UPPER(LTRIM(TU.coluserEmail))
            INNER JOIN dbo.AMC_ChapterMaster CH WITH (NOLOCK)
                ON CH.ChapterID = TS.ChapterID
            OUTER APPLY
            (
                SELECT TOP (1) CM.Class
                FROM dbo.AMC_ClassMaster CM WITH (NOLOCK)
                WHERE CM.StudentID = TS.colStudentID
                ORDER BY CM.Class
            ) C1
            WHERE TS.colStatus = 'W'
              AND TS.ChapterID IN (SELECT ChapterID FROM dbo.GettingAuthorizedChapter(@UserName))
        )
        SELECT DISTINCT
            W.StudentID,
            W.StudentName,
            W.StudentEmail,
            W.School,
            W.Grade,
            W.ParentName,
            W.City,
            W.State,
            W.Country,
            W.PhoneNumber,
            W.EmailAddress,
            W.EventSession,
            Class =
                CASE
                    WHEN W.ClassCode = 'DS' THEN 'Data Science'
                    WHEN W.ClassCode = 'AI' THEN 'Artificial Intelligence'
                    WHEN W.ClassCode = 'GD' THEN 'Game Development'
                    WHEN W.ClassCode = 'AD' THEN 'App Development'
                    WHEN W.ClassCode = 'DM' THEN 'Data Management'
                    WHEN W.ClassCode = 'ED' THEN 'Engineering Design'
                    WHEN W.ClassCode = 'ST' THEN 'PSAT'
                    WHEN W.ClassCode = 'AT' THEN 'ACT'
                    WHEN W.ClassCode = 'JB' THEN 'Junior Beginner'
                    WHEN W.ClassCode = 'JI' THEN 'Junior Intermediate'
                    WHEN W.ClassCode = 'JA' THEN 'Junior Advanced'
                    WHEN W.ClassCode = 'SB' THEN 'Senior Beginner'
                    WHEN W.ClassCode = 'SA' THEN 'Senior Advanced'
                END,
            W.EventLocation,
            W.RegisteredDate,
            W.StudentClassInfo,
            W.Password,
            DC.ApplicationStatus
        FROM WaitingBase W
        INNER JOIN #DuplicateCheck DC
            ON DC.StudentID = W.StudentID
        ORDER BY DC.ApplicationStatus DESC, W.StudentID DESC;
    END

    DROP TABLE #DuplicateCheck;
END
GO
