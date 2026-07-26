CREATE  proc [dbo].[AMC_spGetChannel] 
AS
BEGIN
Select [Image],Title,Link,[Description] from AMC_tblChannel with (NOLOCK)					 
Order by ChannelID 
END