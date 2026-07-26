CREATE TABLE [dbo].[AMC_tblAccountPayable](
	[ApID] [int] IDENTITY(1,1) NOT NULL,
	[PayableTo] [varchar](100) NOT NULL,
	[Description] [varchar](200) NOT NULL,
	[PaymentMode] [varchar](20) NOT NULL,
	[PaymentDate] [datetime] NOT NULL,
	[Amount] [money] NOT NULL,
	[ExpenseType] [varchar](20) NOT NULL,
	[Documents] [varchar](100) NULL,
	[Comments] [varchar](1000) NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[ChangeBy] [varchar](50) NULL,
	[ChangeDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblAccountPayable] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AMC_tblAccountPayable] ADD  DEFAULT (getdate()) FOR [ChangeDate]