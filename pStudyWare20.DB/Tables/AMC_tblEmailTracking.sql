CREATE TABLE [dbo].[AMC_tblEmailTracking](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[SendFrom] [varchar](50) NOT NULL,
	[SendTo] [varchar](50) NOT NULL,
	[Subject] [varchar](500) NOT NULL,
	[Message] [nvarchar](max) NOT NULL,
	[SendBy] [varchar](50) NULL,
	[SendDate] [datetime] NULL,
	[Status] [char](1) NOT NULL,
	[chapterID] [int] NULL,
	[UserType] [char](1) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblEmailTracking] ADD  DEFAULT (getdate()) FOR [SendDate]
GO
ALTER TABLE [dbo].[AMC_tblEmailTracking] ADD  DEFAULT ('N') FOR [Status]