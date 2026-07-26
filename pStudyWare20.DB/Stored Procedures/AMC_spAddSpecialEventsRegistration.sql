CREATE  PROCEDURE [dbo].[AMC_spAddSpecialEventsRegistration]
    @FirstName varchar(100), 
	@LastName varchar(100), 
	@Grade varchar(30),
	@School varchar(100),
	@Email varchar(100),
	@Phone varchar(30),
	@City varchar(30),
	@State varchar(30),
	@Country varchar(30),
	@EventName varchar(30)
AS 
	 BEGIN
			INSERT INTO [dbo].[AMC_tblSpecialEventsRegistration]
			   ([FirstName]
			   ,[LastName]
			   ,[Grade]
			   ,[School]
			   ,[Email]
			   ,[Phone]
			   ,[City]
			   ,[State]
			   ,[Country]
			   ,[EventName]
			   ,[ApprovalStatus]
			   ,[ChapterID]
			   ,[InsertDate]
			   ,[ModifiedDate]
			   )
			Values
				(
				 @FirstName
				,@LastName
				,@Grade
				,@School
				,@Email
				,@Phone
				,@City
	   			,@State
	   			,@Country
	   			,@EventName
				,'N'
				,1
				,Getdate()
				,Getdate()
				)
	END