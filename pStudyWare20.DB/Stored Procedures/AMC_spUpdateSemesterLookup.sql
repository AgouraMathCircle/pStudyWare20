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