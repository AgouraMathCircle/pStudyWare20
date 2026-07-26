CREATE TABLE [dbo].[AMC_tblUsers](
	[coluserID] [int] IDENTITY(1,1) NOT NULL,
	[coluserfName] [varchar](50) NOT NULL,
	[coluserlName] [varchar](50) NULL,
	[coluserAddress] [varchar](300) NULL,
	[coluserCity] [varchar](50) NULL,
	[coluserState] [varchar](30) NULL,
	[coluserZip] [varchar](5) NULL,
	[coluserPhNo] [varchar](30) NULL,
	[coluserEmail] [varchar](100) NULL,
	[coluserStatus] [char](1) NULL,
	[colSecurelvl] [char](1) NULL,
	[RegisteredDate] [datetime] NULL,
	[InsertDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
	[coluserCountry] [varchar](50) NULL,
	[colParentEmail] [varchar](100) NULL,
 CONSTRAINT [IDXC_AMC_tblUsers_colUserID] PRIMARY KEY CLUSTERED 
(
	[coluserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblUsers] ADD  DEFAULT ('a') FOR [coluserStatus]
GO
ALTER TABLE [dbo].[AMC_tblUsers] ADD  DEFAULT ('p') FOR [colSecurelvl]
GO
ALTER TABLE [dbo].[AMC_tblUsers] ADD  DEFAULT (getdate()) FOR [RegisteredDate]
GO
ALTER TABLE [dbo].[AMC_tblUsers] ADD  DEFAULT (getdate()) FOR [InsertDate]
GO
ALTER TABLE [dbo].[AMC_tblUsers] ADD  DEFAULT (getdate()) FOR [ModifiedDate]