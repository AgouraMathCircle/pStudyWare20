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