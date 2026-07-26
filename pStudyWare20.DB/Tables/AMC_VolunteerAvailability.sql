CREATE TABLE [dbo].[AMC_VolunteerAvailability](
	[RowID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[Semester] [varchar](5) NOT NULL,
	[Session] [varchar](20) NOT NULL,
	[Response] [char](1) NOT NULL,
	[Comments] [varchar](300) NULL,
	[InsertedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[ChapterID] [int] NULL,
	[Class] [char](2) NULL,
PRIMARY KEY CLUSTERED 
(
	[RowID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_VolunteerAvailability] ADD  DEFAULT (getdate()) FOR [InsertedDate]
GO
ALTER TABLE [dbo].[AMC_VolunteerAvailability] ADD  DEFAULT (getdate()) FOR [UpdatedDate]