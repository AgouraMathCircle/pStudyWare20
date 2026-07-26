CREATE TABLE [dbo].[AMC_ExamMaster_RowScoreLookup](
	[RowID] [int] IDENTITY(1,1) NOT NULL,
	[ChapterID] [int] NULL,
	[Semester] [char](5) NULL,
	[Session] [varchar](30) NULL,
	[ExamType] [varchar](50) NULL,
	[Category] [varchar](30) NULL,
	[RawScore] [int] NOT NULL,
	[ReportedScore] [int] NOT NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_ExamMaster_RowScoreLookup] ADD  DEFAULT (getdate()) FOR [CreatedDate]