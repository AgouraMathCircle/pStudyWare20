CREATE TABLE [dbo].[AMC_tblSpecialEventsRegistration](
	[RequestID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NULL,
	[City] [varchar](50) NULL,
	[School] [varchar](200) NULL,
	[Grade] [varchar](30) NULL,
	[Email] [varchar](100) NULL,
	[Phone] [varchar](30) NULL,
	[EventName] [varchar](50) NULL,
	[InsertDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
	[chapterID] [int] NULL,
	[State] [varchar](30) NULL,
	[Country] [varchar](30) NULL,
	[ApprovalStatus] [char](1) NULL,
PRIMARY KEY CLUSTERED 
(
	[RequestID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]