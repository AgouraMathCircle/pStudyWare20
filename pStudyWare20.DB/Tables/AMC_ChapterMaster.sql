CREATE TABLE [dbo].[AMC_ChapterMaster](
	[ChapterID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NULL,
	[Program] [varchar](20) NULL,
	[Location] [varchar](100) NOT NULL,
	[Address] [varchar](300) NOT NULL,
	[City] [varchar](30) NOT NULL,
	[State] [varchar](30) NOT NULL,
	[PostalCode] [varchar](20) NOT NULL,
	[Country] [varchar](30) NOT NULL,
	[ContactPerson] [varchar](50) NOT NULL,
	[ContactPhone] [varchar](20) NOT NULL,
	[ContactEmail] [varchar](50) NOT NULL,
	[SupportEmail] [varchar](50) NOT NULL,
	[Emailsuffix] [char](2) NOT NULL,
	[StartingDate] [datetime] NOT NULL,
	[Active] [bit] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedBy] [varchar](50) NULL,
	[UpdatedDate] [datetime] NULL,
	[IsOnlineExamActive] [bit] NULL,
	[ChapterDisplayOrder] [int] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_ChapterMaster] ADD  DEFAULT ((0)) FOR [Active]
GO
ALTER TABLE [dbo].[AMC_ChapterMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AMC_ChapterMaster] ADD  DEFAULT (getdate()) FOR [UpdatedDate]
GO
ALTER TABLE [dbo].[AMC_ChapterMaster] ADD  DEFAULT ((0)) FOR [ChapterDisplayOrder]