CREATE PROCEDURE [dbo].[AMC_spAddVolunteersRequest]
    @FirstName varchar(100), 
	@LastName varchar(100), 
	@Email varchar(100),
	@Phone varchar(30),
	@City varchar(30),
	@School varchar(100),
	@Grade varchar(30),
	@EnrolledSession varchar(5),
	@drLocation int,
	@Interest varchar(30),
	@Comments varchar(2000)
AS 
	 BEGIN
			INSERT INTO [dbo].[AMC_tblVolunteersRequest]
			   ([FirstName]
			   ,[LastName]
			   ,[Email]
			   ,[Phone]
			   ,[City]
			   ,[School]
			   ,[Grade]
			   ,[EnrolledSession]
			   ,[ChapterID]
			   ,[Interest]
			   ,[Comments]
			   ,[InsertDate]
			   ,[ModifiedDate]
			   )
			Values
				(
				 @FirstName
				,@LastName
				,@Email
				,@Phone
				,@City
	   			,@School
				,@Grade
				,@EnrolledSession
				,@drLocation
				,@Interest
				,@Comments
				,Getdate()
				,Getdate()
				)
	END