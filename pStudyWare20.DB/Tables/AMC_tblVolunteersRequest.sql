CREATE TABLE [dbo].[AMC_tblVolunteersRequest](
	[RequestID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NULL,
	[Email] [varchar](100) NULL,
	[Phone] [varchar](30) NULL,
	[City] [varchar](50) NULL,
	[School] [varchar](200) NULL,
	[Grade] [varchar](30) NULL,
	[Comments] [varchar](2000) NULL,
	[Approved] [bit] NULL,
	[InsertDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
	[EnrolledSession] [varchar](5) NULL,
	[Interest] [varchar](30) NULL,
	[ChapterID] [int] NULL,
	[DuplicateID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[RequestID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblVolunteersRequest] ADD  DEFAULT ((0)) FOR [Approved]
GO
ALTER TABLE [dbo].[AMC_tblVolunteersRequest] ADD  DEFAULT ((0)) FOR [DuplicateID]