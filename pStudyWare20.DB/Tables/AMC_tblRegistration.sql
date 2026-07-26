CREATE TABLE [dbo].[AMC_tblRegistration](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Semester] [varchar](5) NOT NULL,
	[StudentID] [int] NULL,
	[InsertDate] [datetime] NULL,
	[Status] [char](1) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblRegistration] ADD  DEFAULT ('N') FOR [Status]