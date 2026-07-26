CREATE TABLE [dbo].[AMC_AuthorizedChapter](
	[RowID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[ChapterID] [int] NOT NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ChangeBy] [varchar](50) NULL,
	[ChangeDate] [datetime] NOT NULL,
 CONSTRAINT [PK_AMC_AuthorizedChapter] PRIMARY KEY CLUSTERED 
(
	[UserID] ASC,
	[ChapterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_AuthorizedChapter] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AMC_AuthorizedChapter] ADD  DEFAULT (getdate()) FOR [ChangeDate]