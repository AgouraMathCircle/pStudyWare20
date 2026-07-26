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
          ,ISNULL([FinalExamDisplay], 'N') AS FinalExamDisplay
          ,ISNULL([FinalExamDisplayChapter], '') AS FinalExamDisplayChapter
          ,ISNULL([OnlineExamDisplayChapter], '') AS OnlineExamDisplayChapter
      FROM [dbo].[AMC_tblLookupSemester] WITH (NOLOCK);
END