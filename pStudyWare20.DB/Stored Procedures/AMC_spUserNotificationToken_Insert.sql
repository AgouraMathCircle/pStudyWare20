CREATE proc [dbo].[AMC_spUserNotificationToken_Insert] 
 @UserName varchar(100)
,@DeviceToken varchar(500)
,@DevicePlatform varchar(100)
,@DeviceIdiom varchar(100)
,@DeviceVersion varchar(50)
,@DeviceManufacturer varchar(50)
,@DeviceModel varchar(50)
,@DeviceType varchar(50)

AS
BEGIN
	 declare @tokenCount int

	select @tokenCount=count(*) from  [dbo].[AMC_tblUserNotificationToken]  where [UserName] =ltrim(@UserName)

	IF(@tokenCount = 0)
			BEGIN
			INSERT INTO [dbo].[AMC_tblUserNotificationToken]
           ([UserName]
           ,[DeviceToken]
           ,[DevicePlatform]
           ,[DeviceIdiom]
           ,[DeviceVersion]
           ,[DeviceManufacturer]
           ,[DeviceModel]
           ,[DeviceType]
		   ,[CreatedDate])
     VALUES
           (@UserName
           ,@DeviceToken
           ,@DevicePlatform
           ,@DeviceIdiom
           ,@DeviceVersion
           ,@DeviceManufacturer
           ,@DeviceModel
           ,@DeviceType
		   ,getdate())
			END
	ELSE
			BEGIN	 
				  UPDATE [dbo].[AMC_tblUserNotificationToken]
			   SET [DeviceToken] = @DeviceToken
				  ,[DevicePlatform] = @DevicePlatform
				  ,[DeviceIdiom] = @DeviceIdiom
				  ,[DeviceVersion] = @DeviceVersion
				  ,[DeviceManufacturer] = @DeviceManufacturer
				  ,[DeviceModel] = @DeviceModel
				  ,[DeviceType] = @DeviceType
				  ,[UpdatedDate] = getdate()
			 WHERE [UserName] =ltrim(@UserName)

			END


END