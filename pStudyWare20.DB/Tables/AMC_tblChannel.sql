CREATE TABLE [dbo].[AMC_tblChannel](
	[ChannelID] [int] IDENTITY(1,1) NOT NULL,
	[Image] [varchar](100) NULL,
	[Title] [varchar](100) NULL,
	[Link] [varchar](300) NULL,
	[Description] [varchar](500) NULL,
	[Createdby] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblChannel] ADD  CONSTRAINT [DF_AMC_tblChannel_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]