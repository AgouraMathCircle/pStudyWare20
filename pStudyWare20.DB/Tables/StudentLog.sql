CREATE TABLE [dbo].[StudentLog](
	[pStudentLogId] [int] IDENTITY(1,1) NOT NULL,
	[fMemberId] [int] NULL,
	[Subject] [varchar](50) NULL,
	[EntryDate] [datetime] NULL,
	[StartTime] [datetime] NULL,
	[EndTime] [datetime] NULL,
	[Chapter] [varchar](500) NULL,
	[Summary] [varchar](500) NULL,
	[Credit] [int] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[ModfiedBy] [varchar](50) NULL,
	[ModifiedDate] [datetime] NULL
) ON [PRIMARY]