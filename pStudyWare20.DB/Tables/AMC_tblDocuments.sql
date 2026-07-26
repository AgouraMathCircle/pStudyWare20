CREATE TABLE [dbo].[AMC_tblDocuments](
	[mDocID] [int] IDENTITY(1,1) NOT NULL,
	[mGrade] [char](2) NULL,
	[mBatch] [char](2) NULL,
	[mTopics] [varchar](100) NULL,
	[mDescription] [varchar](100) NULL,
	[mDocName] [varchar](100) NULL,
	[mSession] [varchar](30) NULL,
	[mDocType] [char](1) NOT NULL,
	[mDocSession] [varchar](5) NULL,
	[Active] [bit] NOT NULL,
	[InsertDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblDocuments] ADD  DEFAULT ('P') FOR [mDocType]
GO
ALTER TABLE [dbo].[AMC_tblDocuments] ADD  DEFAULT ((0)) FOR [Active]