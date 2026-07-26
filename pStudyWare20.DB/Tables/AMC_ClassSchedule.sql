CREATE TABLE [dbo].[AMC_ClassSchedule](
	[Semester] [char](3) NOT NULL,
	[Session] [varchar](20) NULL,
	[ClassDate] [datetime] NOT NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[ChangeBy] [varchar](50) NULL,
	[ChangeDate] [datetime] NULL,
	[Active] [bit] NULL,
	[RowID] [int] IDENTITY(1,1) NOT NULL,
	[ChapterID] [int] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_ClassSchedule] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AMC_ClassSchedule] ADD  DEFAULT (getdate()) FOR [ChangeDate]
GO
ALTER TABLE [dbo].[AMC_ClassSchedule] ADD  DEFAULT ((0)) FOR [Active]