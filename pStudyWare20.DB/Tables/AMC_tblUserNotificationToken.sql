CREATE TABLE [dbo].[AMC_tblUserNotificationToken](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](100) NULL,
	[DeviceToken] [varchar](500) NULL,
	[DevicePlatform] [varchar](100) NULL,
	[DeviceIdiom] [varchar](100) NULL,
	[DeviceVersion] [varchar](50) NULL,
	[DeviceManufacturer] [varchar](50) NULL,
	[DeviceModel] [varchar](50) NULL,
	[DeviceType] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL
) ON [PRIMARY]