CREATE TABLE [dbo].[MemberType](
	[pMemberTypeID] [int] IDENTITY(1,1) NOT NULL,
	[MemberTypeCd] [varchar](5) NULL,
	[MemberTypeDesc] [varchar](100) NULL
) ON [PRIMARY]