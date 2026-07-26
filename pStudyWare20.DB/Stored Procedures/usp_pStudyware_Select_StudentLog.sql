CREATE PROCEDURE [dbo].[usp_pStudyware_Select_StudentLog]
@fMemberID int
AS 
BEGIN
SELECT [pStudentLogId]
      ,[fMemberId]
      ,[Subject]
      ,[EntryDate]
      ,[StartTime]
      ,[EndTime]
      ,[Chapter]
      ,[Summary]
      ,[Credit]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[ModfiedBy]
      ,[ModifiedDate]
  FROM [PranavDB].[dbo].[StudentLog]
  WHERE fMemberId=@fMemberID
END