CREATE PROCEDURE [dbo].[AMC_spAddStudent]
    @FirstName varchar(100), 
	@LastName varchar(100), 
	@Email varchar(100),
	@School varchar(100),
	@Grade varchar(2),
	@drLocation int,
	@ParentID int,
	@SessionID varchar(5),
	@PicPermission char(1), 
	@LiabilitySignature varchar(100),
	@RuleSignature varchar(100)
AS 
	Declare @Location Char(1)

	Set @Location='I'
	IF @drLocation in(1,3) 
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
				 @FirstName
				,@LastName
				,@School
				,@Email
				,@Grade
				,@Location
				,@Location
				,@ParentID
				,@SessionID
				,@PicPermission
				,@LiabilitySignature
				,@RuleSignature
				,getdate()
				,@drLocation
				)

		Declare @StudentID int
		Select @StudentID=max(colStudentID) from AMC_tblStudents WITH (NOLOCK)  

		Declare @class char(2)
		Set @Class=case 
						when @drLocation =3 then 'DS'
						when @drLocation =4 then 'AI'
						when @drLocation =5 then 'ST'
						when @drLocation =6 then 'AT'
						when @drLocation =7 then 'GD'
						when @Grade='1' then 'JB'
						when @Grade='2' then 'JI'
						when @Grade='3' then 'JI'
						when @Grade='4' then 'JA'
						when @Grade='5' then 'SB'
						when @Grade='6' then 'SB'
						when @Grade='7' then 'SI'
						when @Grade='8' then 'SI'
						when @Grade='9' then 'SA'
						when @Grade='10' then 'SA'
						when @Grade='11' then 'SA'
						when @Grade='12' then 'SA'
				 END 

		INSERT INTO [dbo].[AMC_ClassMaster]
           ([StudentID]
           ,[Semester]
           ,[Class]
           ,[CreatedBy]
           ,[CreatedDate]
           ,[ChangeBy]
           ,[ChangeDate])
	   Values(@StudentID
			 ,SUBSTRING(@SessionID,1,1)+SUBSTRING(@SessionID,4,2)
             ,@Class
			,'System'
			,getdate()
		    ,'System'
			,getdate()
	     )
	END