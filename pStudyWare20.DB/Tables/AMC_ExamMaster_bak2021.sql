CREATE TABLE [dbo].[AMC_ExamMaster_bak2021](
	[Semester] [char](5) NULL,
	[Class] [char](2) NOT NULL,
	[ExamType] [varchar](50) NULL,
	[Question] [int] NOT NULL,
	[AnswerKey] [char](1) NOT NULL,
	[Points] [int] NOT NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[RowID] [int] IDENTITY(1,1) NOT NULL,
	[AnswerType] [char](1) NULL,
	[Category] [varchar](30) NULL,
	[AnswerDescription] [varchar](100) NULL,
	[mSession] [varchar](30) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_ExamMaster_bak2021] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AMC_ExamMaster_bak2021] ADD  DEFAULT ('M') FOR [AnswerType]