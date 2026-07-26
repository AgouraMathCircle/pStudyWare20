/****** Object:  UserDefinedTableType [dbo].[AMC_tblTypeExamMasterAnswerKey]    Script Date: 7/26/2026 9:13:43 AM ******/
CREATE TYPE [dbo].[AMC_tblTypeExamMasterAnswerKey] AS TABLE(
	[StudentID] [int] NOT NULL,
	[Semester] [char](5) NOT NULL,
	[Class] [char](2) NOT NULL,
	[Question] [int] NOT NULL,
	[AnswerKey] [char](1) NOT NULL,
	[Points] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ExamType] [varchar](30) NULL,
	[Session] [varchar](50) NULL
)