CREATE TABLE [dbo].[AMC_tblAccountReceivable](
	[ArID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[PaymentMode] [varchar](20) NOT NULL,
	[PaymentDate] [datetime] NOT NULL,
	[Amount] [money] NOT NULL,
	[PayerType] [varchar](20) NULL,
	[Documents] [varchar](100) NULL,
	[Comments] [varchar](1000) NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[ChangeBy] [varchar](50) NULL,
	[ChangeDate] [datetime] NULL
) ON [PRIMARY]