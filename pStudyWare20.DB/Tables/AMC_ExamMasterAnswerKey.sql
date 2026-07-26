CREATE TABLE [dbo].[AMC_ExamMasterAnswerKey](
	[StudentID] [int] NOT NULL,
	[Semester] [char](5) NOT NULL,
	[Class] [char](2) NOT NULL,
	[Question] [int] NOT NULL,
	[AnswerKey] [char](1) NOT NULL,
	[Points] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ExamType] [varchar](30) NULL,
	[Session] [varchar](50) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_ExamMasterAnswerKey] ADD  DEFAULT ((0)) FOR [Points]
GO
ALTER TABLE [dbo].[AMC_ExamMasterAnswerKey] ADD  DEFAULT (getdate()) FOR [CreatedDate]