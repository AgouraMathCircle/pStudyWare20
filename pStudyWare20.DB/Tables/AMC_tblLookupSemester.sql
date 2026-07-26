CREATE TABLE [dbo].[AMC_tblLookupSemester](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[semester] [varchar](5) NOT NULL,
	[Active] [bit] NULL,
	[InsertDate] [datetime] NULL,
	[StartingDate] [date] NULL,
	[RegistrationStatus] [char](1) NULL,
	[RegStartDate] [datetime] NULL,
	[RegCloseDate] [datetime] NULL,
	[DisplayDocumentsFrom] [int] NULL,
	[LastSemester] [char](5) NULL,
	[JBTotalSpace] [int] NULL,
	[JITotalSpace] [int] NULL,
	[JATotalSpace] [int] NULL,
	[SBTotalSpace] [int] NULL,
	[SITotalSpace] [int] NULL,
	[SATotalSpace] [int] NULL,
	[ChapterID] [int] NULL,
	[CurrentExamDate] [date] NULL,
	[CurrentExamDueTime] [datetime] NULL,
	[SemesterName] [varchar](50) NULL,
	[NextSemester] [char](5) NULL,
	[AITotalSpace] [int] NULL,
	[ATTotalSpace] [int] NULL,
	[STTotalSpace] [int] NULL,
	[DSTotalSpace] [int] NULL,
	[MKTotalSpace] [int] NULL,
	[AMC8TotalSpace] [int] NULL,
	[AMC10TotalSpace] [int] NULL,
	[AMC12TotalSpace] [int] NULL,
	[VolunteerAvailability] [char](1) NULL,
	[FinalExamDisplay] [char](1) NULL,
	[FinalExamDisplayChapter] [char](10) NULL,
	[OnlineExamDisplayChapter] [varchar](100) NULL,
	[LastSemesterName] [varchar](50) NULL,
	[NextSemesterName] [varchar](50) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblLookupSemester] ADD  DEFAULT ((75)) FOR [AITotalSpace]
GO
ALTER TABLE [dbo].[AMC_tblLookupSemester] ADD  DEFAULT ((30)) FOR [DSTotalSpace]
GO
ALTER TABLE [dbo].[AMC_tblLookupSemester] ADD  DEFAULT ((300)) FOR [MKTotalSpace]
GO
ALTER TABLE [dbo].[AMC_tblLookupSemester] ADD  DEFAULT ((60)) FOR [AMC8TotalSpace]
GO
ALTER TABLE [dbo].[AMC_tblLookupSemester] ADD  DEFAULT ((30)) FOR [AMC10TotalSpace]
GO
ALTER TABLE [dbo].[AMC_tblLookupSemester] ADD  DEFAULT ((10)) FOR [AMC12TotalSpace]
GO
ALTER TABLE [dbo].[AMC_tblLookupSemester] ADD  CONSTRAINT [DF_AMC_tblLookupSemester_OnlineExamDisplayChapter]  DEFAULT ('') FOR [OnlineExamDisplayChapter]