CREATE PROCEDURE [dbo].[AMC_spAddInstructor]
	@InstructorID int,
	@firstname varchar(50) = '',
	@lastname varchar(50) = '',
	@emailId varchar(100) = '',
	@ChapterID int,
	@Class char(2), 
	@Section char(1),
	@Phone varchar(20),
	@Type Char (1)='V',
	@MemberStatus int=1
AS
BEGIN
	
	
	--------------------------------Declare--------------------------------------------
	Declare @UserName varchar(100)
	Declare @rowCnt int
	Declare @MemberType char(1)
	Declare @RandomPassword varchar(20)
	-----------------------------Assign Values-----------------------------------------
	Set @UserName=lower(@emailId)
	-------------Generate the Random password------------------------------------------			
	EXEC [dbo].[AMC_spGENERATEPASSWORD] @RandomPassword = @RandomPassword OUTPUT
	-------------Validate the Vaolunteer using same Email ID for Student Account------			
	SELECT	@rowCnt = COUNT(*) FROM MemberMaster (NOLOCK) 
	WHERE	lower(ltrim(UserName)) = lower(ltrim(@UserName))  
	And  MemberType='S'
	IF(@rowCnt>0)  
		BEGIN
		 	Set @UserName= STUFF(@UserName, 2, 0, '.')
		END
	------------Assign the User Type----------------------------------------------------	 
	IF (@Type='A')
		BEGIN 
			Set @MemberType='A'
		END 
	ELSE IF (@Type='P' or @Type='C' or @Type='S')
		BEGIN 
			Set @MemberType='I'
		END 
	ELSE 
	BEGIN 
		Set @MemberType='V'
	END 
	------------------Adding New Instructor List------------------------------------------
	IF @InstructorID=0
			BEGIN
					SET @MemberStatus=1	

					INSERT INTO MemberMaster
						   ([FirstName]
						   ,[LastName]
						   ,[ChapterID]
						   ,[UserName]
						   ,[Password]
						   ,[EmailID]
						   ,[MemberType]
						   ,[CreatedBy]
						   ,[CreatedDate]
						   ,[Approved]
						   ,[Active]
						    )
						VALUES	
						(
						@firstname,
						@lastname,
						@ChapterID,
						@UserName,
						@RandomPassword,
						@UserName,
						@MemberType,
						GETDATE(),
						GETDATE(),
						@MemberStatus, 
						@MemberStatus 
						)
			
			Declare @InstrutorID int
			SELECT @InstrutorID=SCOPE_IDENTITY()
						
						 INSERT INTO [dbo].[AMC_InstructorMaster]
						   ([InstructorID]
						   ,[ChapterID]
						   ,[Class]
						   ,[Section]
						   ,[Type]
						   ,[ContactPhone]
						   )
						VALUES
						   (@InstrutorID
						   ,@ChapterID
						   ,@Class
						   ,@Section
						   ,@Type
						   ,@Phone
							)  
		END 
	------------------Updating Instructor List------------------------------------------
	ELSE 
		BEGIN
			Update MemberMaster
				Set FirstName=@firstname
				,LastName=@lastname
				,ChapterID=@ChapterID
				,MemberType=@MemberType
				,UserName=@UserName
				,EmailID=@emailId
				,Approved=@MemberStatus 
				,Active=@MemberStatus 
			Where pMemberID=@InstructorID

			Update AMC_InstructorMaster
				Set Type=@Type
				,ChapterID=@ChapterID
				,Class=@Class
				,Section=@Section
				,ContactPhone=@Phone
			Where InstructorID=@InstructorID
		END 

	END