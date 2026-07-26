CREATE PROC [dbo].[AMCAPI_spDashboardMessage_Select]
(@ChapterID int=0)
AS
BEGIN
	SELECT 
       [Type]
      ,[Message]
      ,[PostedBy]
      ,[PostedDate]
      ,[ChapterID]
	FROM  [dbo].[AMC_tblPostMessage] WITH (NOLOCK)
	Where [Active]=1
END