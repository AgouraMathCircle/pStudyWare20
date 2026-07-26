CREATE TABLE [dbo].[AMC_tblTimeTracking](
	[LogId] [int] IDENTITY(1,1) NOT NULL,
	[MemberId] [int] NULL,
	[TaskName] [varchar](50) NULL,
	[DateVolunteer] [datetime] NULL,
	[StartTime] [time](7) NULL,
	[EndTime] [time](7) NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
	[TaskDescription] [varchar](100) NULL,
	[Approved] [bit] NULL,
	[Comments] [varchar](100) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AMC_tblTimeTracking] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AMC_tblTimeTracking] ADD  DEFAULT (getdate()) FOR [ModifiedDate]
GO
ALTER TABLE [dbo].[AMC_tblTimeTracking] ADD  CONSTRAINT [DF_AMC_tblTimeTracking_Approved]  DEFAULT ((0)) FOR [Approved]