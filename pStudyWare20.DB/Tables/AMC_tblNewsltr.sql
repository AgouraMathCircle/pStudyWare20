CREATE TABLE [dbo].[AMC_tblNewsltr](
	[colLtrID] [int] IDENTITY(1,1) NOT NULL,
	[colEmail] [varchar](255) NOT NULL,
	[RequestedDate] [datetime] NULL,
	[InsertDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[colLtrID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblNewsltr] ADD  DEFAULT (getdate()) FOR [RequestedDate]
GO
ALTER TABLE [dbo].[AMC_tblNewsltr] ADD  DEFAULT (getdate()) FOR [InsertDate]
GO
ALTER TABLE [dbo].[AMC_tblNewsltr] ADD  DEFAULT (getdate()) FOR [ModifiedDate]