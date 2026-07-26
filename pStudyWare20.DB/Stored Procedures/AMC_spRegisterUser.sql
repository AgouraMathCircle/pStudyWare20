CREATE PROCEDURE [dbo].[AMC_spRegisterUser]
    @FirstName varchar(50), 
	@LastName varchar(50), 
	@Address varchar(50),
	@City varchar(50),
	@State char(2),
	@Zip varchar(5),
	@PhNo varchar(20),
	@Email varchar(100),
	@Country varchar(50),
	@ParentID int output
AS 
BEGIN
Declare @ExistCnt int

Select @ExistCnt=Count(*) from AMC_tblUsers WITH (NOLOCK) where upper(ltrim(coluserEmail))=upper(ltrim(@Email))

	if @ExistCnt=0 
		Begin
			insert into AMC_tblUsers
				(coluserfName
				,coluserlName
				,coluserAddress
				,coluserCity
				,coluserState
				,coluserZip
				,coluserPhNo
				,coluserEmail
				,coluserCountry
				)
			values
				(@FirstName
				,@LastName
				,@Address
				,@City
				,@State
				,@zip
				,@phno
				,@email
				,@Country
				)

				INSERT INTO MemberMaster
			   (FirstName
			   ,LastName
			   ,UserName
			   ,[Password]
			   ,EmailID
			   ,MemberType
			   ,LastActiveDate
			   ,CreatedBy
			   ,CreatedDate
			   ,Approved
			   ,Active)
			   values
				(@FirstName
				,@LastName 
				,@email
				,'password'
				,@email
				,'S'
				,getdate()
				,getdate()
				,getdate()
				,0 
				,0)
  
		End
	select @ParentID= coluserID from AMC_tblUsers WITH (NOLOCK) where ltrim(coluserEmail)=ltrim(@Email)
END