CREATE TABLE [dbo].[AMC_MailMerger](
	[RowID] [int] IDENTITY(1,1) NOT NULL,
	[EmailSendTo] [varchar](100) NULL,
	[EmailSubject] [varchar](300) NULL,
	[EmailBody] [nvarchar](max) NULL,
	[DataValue1] [varchar](300) NULL,
	[DataValue2] [varchar](300) NULL,
	[DataValue3] [varchar](300) NULL,
	[DataValue5] [varchar](300) NULL,
	[DataValue6] [varchar](300) NULL,
	[EmailSendStatus] [bit] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_MailMerger] ADD  CONSTRAINT [DF_AMC_MailMerger_EmailSendStatus]  DEFAULT ((0)) FOR [EmailSendStatus]
GO
ALTER TABLE [dbo].[AMC_MailMerger] ADD  DEFAULT ('System') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[AMC_MailMerger] ADD  DEFAULT (getdate()) FOR [CreatedDate]