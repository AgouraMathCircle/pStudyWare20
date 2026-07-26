CREATE TABLE [dbo].[AMC_tblMeetingSchedule](
	[RowID] [int] IDENTITY(1,1) NOT NULL,
	[ChapterID] [int] NULL,
	[Class] [char](2) NULL,
	[Section] [char](1) NULL,
	[MeetingProviderURL] [varchar](300) NULL,
	[MeetingURL] [varchar](300) NULL,
	[MeetingID] [varchar](30) NOT NULL,
	[Passcode] [varchar](30) NULL,
	[AdminLogin] [varchar](100) NULL,
	[AdminPassCode] [varchar](30) NULL,
	[IncludeSection] [bit] NOT NULL,
	[Active] [bit] NOT NULL,
	[InsertDate] [datetime] NULL,
	[UpdatedtDate] [datetime] NULL,
	[MeetingTime] [time](0) NULL,
	[MeetingDate] [date] NULL
) ON [PRIMARY]