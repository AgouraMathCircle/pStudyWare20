-- Semester lookup: VolunteerAvailability toggle (Y/N).
-- Controls volunteer/instructor availability UI via login (MemberRepository / AMC_spSelectSemesterLookup).

IF COL_LENGTH('dbo.AMC_tblLookupSemester', 'VolunteerAvailability') IS NULL
BEGIN
    ALTER TABLE [dbo].[AMC_tblLookupSemester]
    ADD [VolunteerAvailability] [char](1) NOT NULL
        CONSTRAINT [DF_AMC_tblLookupSemester_VolunteerAvailability] DEFAULT ('N');
END
GO

IF OBJECT_ID(N'dbo.AMC_spSelectSemesterLookup', N'P') IS NOT NULL
    DROP PROCEDURE dbo.AMC_spSelectSemesterLookup;
GO

CREATE PROC [dbo].[AMC_spSelectSemesterLookup]
AS
BEGIN
    SELECT [ID]
          ,[semester]
          ,[Active]
          ,[InsertDate]
          ,CONVERT(VARCHAR(10), StartingDate, 101) AS StartingDate
          ,[RegistrationStatus]
          ,CONVERT(VARCHAR(10), RegStartDate, 101) AS RegStartDate
          ,CONVERT(VARCHAR(10), RegCloseDate, 101) AS RegCloseDate
          ,[DisplayDocumentsFrom]
          ,[LastSemester]
          ,[JBTotalSpace]
          ,[JITotalSpace]
          ,[JATotalSpace]
          ,[SBTotalSpace]
          ,[SITotalSpace]
          ,[SATotalSpace]
          ,CONVERT(VARCHAR(10), CurrentExamDate, 101) AS CurrentExamDate
          ,[CurrentExamDueTime]
          ,ISNULL([VolunteerAvailability], 'N') AS VolunteerAvailability
      FROM [dbo].[AMC_tblLookupSemester] WITH (NOLOCK);
END
GO

IF OBJECT_ID(N'dbo.AMC_spUpdateSemesterLookup', N'P') IS NOT NULL
    DROP PROCEDURE dbo.AMC_spUpdateSemesterLookup;
GO

CREATE PROC [dbo].[AMC_spUpdateSemesterLookup]
(
    @ID int = 0,
    @semester varchar(5),
    @LastSemester varchar(5),
    @StartingDate Datetime,
    @RegStartDate Datetime,
    @RegCloseDate Datetime,
    @DisplayDocumentsFrom int,
    @RegistrationStatus char(1),
    @JBTotalSpace int,
    @JITotalSpace int,
    @JATotalSpace int,
    @SBTotalSpace int,
    @SITotalSpace int,
    @SATotalSpace int,
    @CurrentExamDate Date,
    @CurrentExamDueTime DateTime,
    @VolunteerAvailability char(1) = 'N'
)
AS
BEGIN
    UPDATE [dbo].[AMC_tblLookupSemester]
       SET [semester] = @semester
          ,[StartingDate] = @StartingDate
          ,[RegistrationStatus] = @RegistrationStatus
          ,[RegStartDate] = @RegStartDate
          ,[RegCloseDate] = @RegCloseDate
          ,[DisplayDocumentsFrom] = @DisplayDocumentsFrom
          ,[LastSemester] = @LastSemester
          ,[JBTotalSpace] = @JBTotalSpace
          ,[JITotalSpace] = @JITotalSpace
          ,[JATotalSpace] = @JATotalSpace
          ,[SBTotalSpace] = @SBTotalSpace
          ,[SITotalSpace] = @SITotalSpace
          ,[SATotalSpace] = @SATotalSpace
          ,[CurrentExamDate] = @CurrentExamDate
          ,[CurrentExamDueTime] = @CurrentExamDueTime
          ,[VolunteerAvailability] = ISNULL(@VolunteerAvailability, 'N');
END
GO
