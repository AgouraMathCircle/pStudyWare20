CREATE TABLE [dbo].[Comments](
	[pCommentID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NULL,
	[EmailID] [varchar](100) NULL,
	[Comments] [nvarchar](max) NULL,
	[PostedDate] [datetime] NOT NULL,
	[DeleteDate] [datetime] NULL,
	[DeleteBy] [varchar](100) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]