CREATE TABLE [dbo].[AMC_tblTestimonials](
	[colTestID] [int] IDENTITY(1,1) NOT NULL,
	[colTestUser] [varchar](255) NULL,
	[colTestEmail] [varchar](255) NULL,
	[colTestMessage] [varchar](8000) NULL,
	[colTestDate] [date] NULL,
	[InsertDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[colTestID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblTestimonials] ADD  DEFAULT (getdate()) FOR [InsertDate]
GO
ALTER TABLE [dbo].[AMC_tblTestimonials] ADD  DEFAULT (getdate()) FOR [ModifiedDate]