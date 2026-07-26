CREATE PROCEDURE [dbo].[AMC_spAddEmailTracking]
@SendFrom varchar(50) 
,@SendTo varchar(50) 
,@Subject varchar(500) 
,@Message nvarchar(max) 
,@SendBy  varchar(50)
,@ID int =0
,@Mode char(1)='N'
,@ChapterID int=1
AS
BEGIN
	Declare @UserType char(1)
	Set @UserType=''
	 
	 IF @ChapterID =0 
	 BEGIN
		Select @ChapterID=ChapterID from AMC_ClassType where InstructorEmailGroup=@SendTo
	 END   

	-------------FInding the UserType------------------------------------
	Select @UserType=MemberType from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@SendFrom))


	
	IF @Mode='U'
		BEGIN
			 Update AMC_tblEmailTracking Set Status='V' 
			 Where  upper(ltrim(Sendto))=upper(ltrim(@SendFrom)) and Status='N'
		END
	ELSE
		BEGIN
				INSERT INTO [dbo].[AMC_tblEmailTracking]
					   ([SendFrom]
					   ,[SendTo]
					   ,[Subject]
					   ,[Message]
					   ,[SendBy]
					   ,[SendDate]
					   ,[Status]
					   ,[ChapterID]
					   ,[UserType]
					   )
				 VALUES
					   (@SendFrom 
					   ,@SendTo 
					   ,REPLACE(@Subject, '#', '')
					   ,@Message 
					   ,@SendBy 
					   ,getdate()
					   ,'N'
					   ,@ChapterID
					   ,@UserType
					   )
				IF @ID>0
				BEGIN
				   Update AMC_tblEmailTracking Set Status=@Mode Where ID=@ID
				END 
		END 
END