CREATE TABLE [dbo].[AMC_ClassType](
	[RowID] [int] IDENTITY(1,1) NOT NULL,
	[Class] [char](2) NOT NULL,
	[ClassName] [varchar](30) NULL,
	[Section] [char](1) NULL,
	[StudentEmailGroup] [varchar](100) NULL,
	[InstructorEmailGroup] [varchar](100) NULL,
	[DisplayOrder] [int] NOT NULL,
	[ChapterID] [int] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_ClassType] ADD  CONSTRAINT [DF_AMC_ClassType_CreatedBy]  DEFAULT ('Admin') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[AMC_ClassType] ADD  CONSTRAINT [DF_AMC_ClassType_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]