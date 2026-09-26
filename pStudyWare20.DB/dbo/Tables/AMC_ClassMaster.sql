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

CREATE NONCLUSTERED INDEX [IDXC_AMCClassMaster_StudentID] ON [dbo].[AMC_ClassMaster]
(
	[StudentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

ALTER TABLE [dbo].[AMC_ClassMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO

ALTER TABLE [dbo].[AMC_ClassMaster] ADD  DEFAULT (getdate()) FOR [ChangeDate]
GO

ALTER TABLE [dbo].[AMC_ClassMaster] ADD  DEFAULT ('A') FOR [Section]
