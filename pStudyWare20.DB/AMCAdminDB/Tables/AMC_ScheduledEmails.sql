CREATE TABLE [AMCAdminDB].[AMC_ScheduledEmails](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[TargetEmail] [varchar](100) NULL,
	[SendTo] [varchar](500) NULL,
	[SendCc] [varchar](500) NULL,
	[SendBcc] [varchar](500) NULL,
	[Subject] [varchar](200) NULL,
	[Body] [nvarchar](max) NULL,
	[ScheduledTime] [datetime] NULL,
	[IsSent] [bit] NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [AMCAdminDB].[AMC_ScheduledEmails] ADD  DEFAULT ((0)) FOR [IsSent]
GO

ALTER TABLE [AMCAdminDB].[AMC_ScheduledEmails] ADD  DEFAULT (getdate()) FOR [CreatedAt]
