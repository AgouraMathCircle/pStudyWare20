-- Semester lookup: OnlineExamDisplayChapter — comma-separated chapter numbers (e.g. 1,2,).

IF COL_LENGTH('dbo.AMC_tblLookupSemester', 'FinalExamDisplayChapter') IS NULL
BEGIN
    ALTER TABLE [dbo].[AMC_tblLookupSemester]
    ADD FinalExamDisplayChapter [varchar](100) NULL
        CONSTRAINT [DF_AMC_tblLookupSemester_FinalExamDisplayChapter] DEFAULT ('');
END
GO

IF COL_LENGTH('dbo.AMC_tblLookupSemester', 'OnlineExamDisplayChapter') IS NULL
BEGIN
    ALTER TABLE [dbo].[AMC_tblLookupSemester]
    ADD [OnlineExamDisplayChapter] [varchar](100) NULL
        CONSTRAINT [DF_AMC_tblLookupSemester_OnlineExamDisplayChapter] DEFAULT ('');
END
GO

IF COL_LENGTH('dbo.AMC_tblLookupSemester', 'VolunteerAvailability') IS NULL
BEGIN
    ALTER TABLE [dbo].[AMC_tblLookupSemester]
    ADD [VolunteerAvailability] [char](1) NOT NULL
        CONSTRAINT [DF_AMC_tblLookupSemester_VolunteerAvailability] DEFAULT ('N');
END
GO

IF COL_LENGTH('dbo.AMC_tblLookupSemester', 'LastSemesterName') IS NULL
BEGIN
    ALTER TABLE [dbo].[AMC_tblLookupSemester]
    ADD [LastSemesterName] [varchar](50) NULL
        CONSTRAINT [DF_AMC_tblLookupSemester_LastSemesterName] DEFAULT ('');
END
GO

IF COL_LENGTH('dbo.AMC_tblLookupSemester', 'NextSemesterName') IS NULL
BEGIN
    ALTER TABLE [dbo].[AMC_tblLookupSemester]
    ADD [NextSemesterName] [varchar](50) NULL
        CONSTRAINT [DF_AMC_tblLookupSemester_NextSemesterName] DEFAULT ('');
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
          ,ISNULL([SemesterName], '') AS SemesterName
          ,ISNULL([NextSemester], '') AS NextSemester
          ,ISNULL([LastSemesterName], '') AS LastSemesterName
          ,ISNULL([NextSemesterName], '') AS NextSemesterName
          ,[JBTotalSpace]
          ,[JITotalSpace]
          ,[JATotalSpace]
          ,[SBTotalSpace]
          ,[SITotalSpace]
          ,[SATotalSpace]
          ,CONVERT(VARCHAR(10), CurrentExamDate, 101) AS CurrentExamDate
          ,[CurrentExamDueTime]
          ,ISNULL([VolunteerAvailability], 'N') AS VolunteerAvailability
          ,ISNULL([FinalExamDisplay], 'N') AS FinalExamDisplay
          ,ISNULL([FinalExamDisplayChapter], '') AS FinalExamDisplayChapter
          ,ISNULL([OnlineExamDisplayChapter], '') AS OnlineExamDisplayChapter
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
    @SemesterName varchar(50) = '',
    @NextSemester varchar(5) = '',
    @LastSemesterName varchar(50) = '',
    @NextSemesterName varchar(50) = '',
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
    @VolunteerAvailability char(1) = 'N',
    @FinalExamDisplay char(1) = 'N',
    @FinalExamDisplayChapter varchar(100) = '',
    @OnlineExamDisplayChapter varchar(100) = ''
)
AS
BEGIN
    UPDATE [dbo].[AMC_tblLookupSemester]
       SET [semester] = @semester
          ,[LastSemester] = @LastSemester
          ,[SemesterName] = ISNULL(@SemesterName, '')
          ,[NextSemester] = ISNULL(@NextSemester, '')
          ,[LastSemesterName] = ISNULL(@LastSemesterName, '')
          ,[NextSemesterName] = ISNULL(@NextSemesterName, '')
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
          ,[VolunteerAvailability] = ISNULL(@VolunteerAvailability, 'N')
          ,[FinalExamDisplay] = ISNULL(@FinalExamDisplay, 'N')
          ,[FinalExamDisplayChapter] = ISNULL(@FinalExamDisplayChapter, '')
          ,[OnlineExamDisplayChapter] = ISNULL(@OnlineExamDisplayChapter, '');
END
GO
