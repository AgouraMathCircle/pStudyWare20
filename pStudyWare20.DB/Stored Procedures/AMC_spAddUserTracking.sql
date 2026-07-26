CREATE PROCEDURE [dbo].[AMC_spAddUserTracking]
 @UserID int
,@userName varchar(100)
,@UserType varchar(10)
,@IPAddress varchar(50)

AS
BEGIN
	INSERT INTO [dbo].[AMC_tblUserTracking]
           ([UserID]
           ,[UserName]
		   ,[UserType]
           ,[LoginDate],[IPAddress])
     VALUES
           (@UserID
           ,@userName
		   ,@UserType
		   ,getdate(),@IPAddress)
 END