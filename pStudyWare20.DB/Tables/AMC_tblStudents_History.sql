CREATE TABLE [dbo].[AMC_tblStudents_History](
	[colStudentID] [int] NOT NULL,
	[colStudentFName] [varchar](255) NOT NULL,
	[colStudentLName] [varchar](255) NULL,
	[colStudentEmail] [varchar](255) NULL,
	[colStudentSchool] [varchar](255) NULL,
	[colStudentGrade] [varchar](2) NULL,
	[colStudentstatus] [char](1) NULL,
	[colStudentPicPerm] [char](1) NULL,
	[colParentID] [int] NULL,
	[colStudentEnrolledSession] [varchar](5) NULL,
	[LiabilitySignature] [varchar](100) NULL,
	[RuleSignature] [varchar](100) NULL,
	[RegisteredDate] [datetime] NULL,
	[InsertDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
	[ColEventLocation] [char](1) NULL,
PRIMARY KEY CLUSTERED 
(
	[colStudentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]