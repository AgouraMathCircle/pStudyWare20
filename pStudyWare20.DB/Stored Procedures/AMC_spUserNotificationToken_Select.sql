CREATE proc [dbo].[AMC_spUserNotificationToken_Select] 
 @UserName varchar(100)
 
AS
BEGIN 

	SELECT [UserName]
           ,[DeviceToken]
           ,[DevicePlatform]
           ,[DeviceIdiom]
           ,[DeviceVersion]
           ,[DeviceManufacturer]
           ,[DeviceModel]
           ,[DeviceType] FROM [dbo].[AMC_tblUserNotificationToken] where username= ltrim(@UserName)
           
     
END