CREATE TABLE [dbo].[AMC_tblVideos](
	[mvideoID] [int] IDENTITY(1,1) NOT NULL,
	[mBatch] [char](2) NULL,
	[mTopics] [varchar](100) NULL,
	[mDescription] [varchar](100) NULL,
	[mURLName] [varchar](100) NULL,
	[mSession] [varchar](30) NULL,
	[Active] [bit] NOT NULL,
	[InsertDate] [datetime] NULL,
	[mDocID] [int] NULL,
	[mSemester] [varchar](5) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblVideos] ADD  DEFAULT ((0)) FOR [Active]