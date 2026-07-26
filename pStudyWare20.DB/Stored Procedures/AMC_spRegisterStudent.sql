CREATE PROCEDURE [dbo].[AMC_spRegisterStudent]
    @pFirstName varchar(50), 
	@pLastName varchar(50), 
	@pAddress varchar(50),
	@pCity varchar(50),
	@pState char(2),
	@pZip varchar(5),
	@pPhNo varchar(20),
	@pEmail varchar(100),
	@pCountry varchar(50),
	@sFirstName varchar(100), 
	@sLastName varchar(100), 
	@sEmail varchar(100),
	@sSchool varchar(100),
	@sGrade varchar(2),
	@sdrLocation int,	
	@sSessionID varchar(5),
	@sPicPermission char(1), 
	@sLiabilitySignature varchar(100),
	@sRuleSignature varchar(100),
	@UserName varchar(100)
AS 
BEGIN

Declare @ExistCnt int
Declare @Location Char(1)
Declare @pParentID int
Declare @UserFirstName varchar(50)
Declare @UserLastName varchar(50)

Set @UserFirstName=@pFirstName
Set @UserLastName=@pLastName
	
	IF  upper(ltrim(@pEmail))!=upper(ltrim(@UserName))
	BEGIN 
		Set @UserFirstName=@sFirstName
		Set @UserLastName=@sLastName
	END 

	DECLARE @RandomPassword varchar(10)

	SET	@RandomPassword = N'agoura'

	EXEC [dbo].[AMC_spGENERATEPASSWORD] @RandomPassword = @RandomPassword OUTPUT

Select @ExistCnt=Count(*) from AMC_tblUsers WITH (NOLOCK) where upper(ltrim(coluserEmail))=upper(ltrim(@UserName))

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
				,colParentEmail
				)
			values
				(@pFirstName
				,@pLastName
				,@pAddress
				,@pCity
				,@pState
				,@pzip
				,@pphno
				,ltrim(rtrim(@UserName))
				,@pCountry
				,@pEmail
				)
			if( (@ExistCnt=0) or (ltrim(@UserName)!=ltrim(@pEmail)))
			BEGIN
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
				(@UserFirstName
				,@UserLastName 
				,ltrim(rtrim(@UserName))
				,@RandomPassword
				,ltrim(rtrim(@UserName))
				,'S'
				,getdate()
				,getdate()
				,getdate()
				,0 
				,0)
				END
  
		End
	select @pParentID= coluserID from AMC_tblUsers WITH (NOLOCK) where ltrim(coluserEmail)=ltrim(@UserName)

	

	Set @Location='I'
	IF @sdrLocation in(1,3) 
	BEGIN 
		Set @Location='O'
	END 

	 BEGIN
			insert into AMC_tblStudents 
				(colStudentFName
				 ,colStudentLName
				 ,colStudentSchool
				 ,colStudentEmail
				 ,colStudentGrade
				 ,ColEventLocation
				 ,RequestedLocation
				 ,colParentID
				 ,colStudentEnrolledSession
				 ,colStudentPicPerm
				 ,LiabilitySignature
				 ,RuleSignature
				 ,SignatureDate
				 ,ChapterID
				 )
			Values
				(
				 @sFirstName
				,@sLastName
				,@sSchool
				,@sEmail
				,@sGrade
				,@Location
				,@Location
				,@pParentID
				,@sSessionID
				,@sPicPermission
				,@sLiabilitySignature
				,@sRuleSignature
				,getdate()
				,@sdrLocation
				)

		Declare @StudentID int
		Select @StudentID=max(colStudentID) from AMC_tblStudents WITH (NOLOCK)  

		Declare @class char(2)
		Set @Class=case 
						when @sdrLocation =3 then 'DS'
						when @sdrLocation =4 then 'AI'
						when @sdrLocation =5 then 'ST'
						when @sdrLocation =6 then 'ED'
						when @sdrLocation =7 then 'AT'
						when @sGrade='1' then 'JB'
						when @sGrade='2' then 'JI'
						when @sGrade='3' then 'JI'
						when @sGrade='4' then 'JA'
						when @sGrade='5' then 'SB'
						when @sGrade='6' then 'SB'
						when @sGrade='7' then 'SI'
						when @sGrade='8' then 'SI'
						when @sGrade='9' then 'SA'
						when @sGrade='10' then 'SA'
						when @sGrade='11' then 'SA'
						when @sGrade='12' then 'SA'
				 END 

		INSERT INTO [dbo].[AMC_ClassMaster]
           ([StudentID]
           ,[Semester]
           ,[Class]
		   ,[Section]
           ,[CreatedBy]
           ,[CreatedDate]
           ,[ChangeBy]
           ,[ChangeDate])
	   Values(@StudentID
			 ,SUBSTRING(@sSessionID,1,1)+SUBSTRING(@sSessionID,4,2)
             ,@Class
			 ,'A'
			,'System'
			,getdate()
		    ,'System'
			,getdate()
	     )
END



End