CREATE TABLE [dbo].[AMC_tblPostMessage](
	[MessageID] [int] IDENTITY(1,1) NOT NULL,
	[Type] [char](3) NOT NULL,
	[Message] [nvarchar](max) NOT NULL,
	[PostedBy] [varchar](50) NULL,
	[PostedDate] [datetime] NULL,
	[SendEmail] [bit] NOT NULL,
	[Active] [bit] NOT NULL,
	[ChapterID] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblPostMessage] ADD  DEFAULT (getdate()) FOR [PostedDate]
GO
ALTER TABLE [dbo].[AMC_tblPostMessage] ADD  DEFAULT ((0)) FOR [SendEmail]
GO
ALTER TABLE [dbo].[AMC_tblPostMessage] ADD  DEFAULT ((0)) FOR [Active]