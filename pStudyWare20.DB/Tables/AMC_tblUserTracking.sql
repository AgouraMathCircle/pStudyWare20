CREATE TABLE [dbo].[AMC_tblUserTracking](
	[RowID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[UserName] [varchar](100) NULL,
	[UserType] [varchar](10) NULL,
	[LoginDate] [datetime] NULL,
	[IPAddress] [varchar](200) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblUserTracking] ADD  DEFAULT (getdate()) FOR [LoginDate]