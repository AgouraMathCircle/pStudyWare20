CREATE TABLE [dbo].[AMC_tblReportCard](
	[mReportCardID] [int] IDENTITY(1,1) NOT NULL,
	[mStudentID] [int] NOT NULL,
	[mType] [varchar](30) NULL,
	[mTotalPoints] [int] NOT NULL,
	[mReceivedPoints] [float] NOT NULL,
	[mGroup] [varchar](50) NULL,
	[mExamDate] [datetime] NULL,
	[mComments] [varchar](1000) NULL,
	[InsertDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
	[mSemster] [varchar](5) NULL,
	[mClass] [char](2) NULL,
	[mSection] [char](1) NULL,
	[ChapterID] [int] NULL
) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [AMC_tblReportCard_mStudentID] ON [dbo].[AMC_tblReportCard]
(
	[mStudentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
