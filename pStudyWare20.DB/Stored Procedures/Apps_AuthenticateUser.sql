CREATE PROC [dbo].[Apps_AuthenticateUser]
(
	@userName varchar(50), 
	@password varchar(50)
)
AS
BEGIN
 
		SELECT 	Username
			,[FirstName] + ' ' + [LastName] AS [Name]
			,[Password]  AS [Password]
			,[EmailID]	 AS [UserName]
			,[pMemberID] AS [UserID]
		FROM	MemberMaster  WITH (NOLOCK)
		WHERE	EmailID =@userName
			and [Password] =@password
			and [Approved]=1 and [MemberType]='S'

 		INSERT INTO [dbo].[AMC_tblUserTracking]
			   ([UserID]
			   ,[UserName]
			   ,[UserType]
			   ,[LoginDate])
		 VALUES
			   (0
			   ,@userName
			   ,'APPUSER'
			   ,getdate())
		 
END