CREATE TABLE [dbo].[AMC_tblStudents](
	[colStudentID] [int] IDENTITY(1,1) NOT NULL,
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
	[colStatus] [char](1) NULL,
	[WaitingListStatus] [char](1) NULL,
	[RegistrationPriority] [int] NULL,
	[RequestedLocation] [char](1) NULL,
	[ChapterID] [int] NULL,
	[SignatureDate] [datetime] NULL,
 CONSTRAINT [IDXC_AMC_tblStudents_colStudentID] PRIMARY KEY CLUSTERED 
(
	[colStudentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblStudents]  WITH CHECK ADD FOREIGN KEY([colParentID])
REFERENCES [dbo].[AMC_tblUsers] ([coluserID])
GO
ALTER TABLE [dbo].[AMC_tblStudents] ADD  DEFAULT ('a') FOR [colStudentstatus]
GO
ALTER TABLE [dbo].[AMC_tblStudents] ADD  DEFAULT ('n') FOR [colStudentPicPerm]
GO
ALTER TABLE [dbo].[AMC_tblStudents] ADD  DEFAULT (getdate()) FOR [RegisteredDate]
GO
ALTER TABLE [dbo].[AMC_tblStudents] ADD  DEFAULT (getdate()) FOR [InsertDate]
GO
ALTER TABLE [dbo].[AMC_tblStudents] ADD  DEFAULT (getdate()) FOR [ModifiedDate]
GO
ALTER TABLE [dbo].[AMC_tblStudents] ADD  DEFAULT ('O') FOR [ColEventLocation]
GO
ALTER TABLE [dbo].[AMC_tblStudents] ADD  DEFAULT ('W') FOR [colStatus]
GO
ALTER TABLE [dbo].[AMC_tblStudents] ADD  DEFAULT ('N') FOR [WaitingListStatus]
GO
ALTER TABLE [dbo].[AMC_tblStudents] ADD  DEFAULT ((0)) FOR [RegistrationPriority]