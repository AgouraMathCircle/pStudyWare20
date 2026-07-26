CREATE TABLE [dbo].[AMC_tblDonors](
	[DonorID] [int] IDENTITY(1,1) NOT NULL,
	[DonorName] [varchar](100) NOT NULL,
	[DonorLevel] [varchar](30) NOT NULL,
	[Year] [int] NOT NULL,
	[PostedBy] [varchar](50) NULL,
	[PostedDate] [datetime] NULL,
	[Semester] [varchar](10) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblDonors] ADD  DEFAULT (getdate()) FOR [PostedDate]