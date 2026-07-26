CREATE TABLE [dbo].[AMC_InstructorMaster](
	[InstructorID] [int] NOT NULL,
	[Type] [char](3) NOT NULL,
	[Class] [char](2) NOT NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[ChangeBy] [varchar](50) NULL,
	[ChangeDate] [datetime] NULL,
	[ContactPhone] [varchar](20) NULL,
	[Section] [char](1) NULL,
	[ChapterID] [int] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_InstructorMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AMC_InstructorMaster] ADD  DEFAULT (getdate()) FOR [ChangeDate]