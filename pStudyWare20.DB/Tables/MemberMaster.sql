CREATE TABLE [dbo].[MemberMaster](
	[pMemberID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NULL,
	[UserName] [varchar](50) NOT NULL,
	[Password] [varchar](50) NOT NULL,
	[EmailID] [varchar](100) NOT NULL,
	[DateOfBirth] [datetime] NULL,
	[LastActiveDate] [datetime] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[ChangeBy] [varchar](50) NULL,
	[ChangeDate] [datetime] NULL,
	[Approved] [bit] NULL,
	[MemberType] [varchar](5) NULL,
	[CreditScore] [int] NULL,
	[ChapterID] [int] NULL,
	[systemAdmin] [char](1) NULL,
	[DefaultChapter] [int] NULL,
	[Active] [bit] NULL,
	[ClassAccess] [char](1) NULL,
	[SuperUser] [char](1) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[MemberMaster] ADD  DEFAULT ('N') FOR [systemAdmin]
GO
ALTER TABLE [dbo].[MemberMaster] ADD  DEFAULT ('N') FOR [ClassAccess]