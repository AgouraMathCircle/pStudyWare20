CREATE TABLE [dbo].[AMC_ClassMaster](
	[StudentID] [int] NOT NULL,
	[Semester] [char](3) NOT NULL,
	[Class] [char](2) NOT NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[ChangeBy] [varchar](50) NULL,
	[ChangeDate] [datetime] NULL,
	[Section] [char](1) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_ClassMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AMC_ClassMaster] ADD  DEFAULT (getdate()) FOR [ChangeDate]
GO
ALTER TABLE [dbo].[AMC_ClassMaster] ADD  DEFAULT ('A') FOR [Section]