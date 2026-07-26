CREATE  proc [dbo].[AMC_spGetMessageCenter_Message] 
@EmailID int
AS
BEGIN
	SELECT 
	[Message]
	FROM [dbo].[AMC_tblEmailTracking] WITH (NOLOCK)
	Where ID=@EmailID
END