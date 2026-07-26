CREATE TABLE [dbo].[AMC_tblStudentDocuments](
	[mDocID] [int] IDENTITY(1,1) NOT NULL,
	[mStudentID] [int] NOT NULL,
	[mDocName] [varchar](100) NOT NULL,
	[Description] [varchar](200) NULL,
	[Type] [varchar](20) NULL,
	[InsertDate] [datetime] NULL
) ON [PRIMARY]