CREATE TABLE [dbo].[AMC_tblTriangularRegistration](
	[RowiID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](250) NULL,
	[Email] [varchar](250) NULL,
	[Country] [varchar](250) NULL,
	[InsertDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblTriangularRegistration] ADD  DEFAULT (getdate()) FOR [InsertDate]