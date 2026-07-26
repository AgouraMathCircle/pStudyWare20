CREATE proc [dbo].[AMC_spUpdateStudentProfile] 
(
@StudentID int =0,
@StudentFName varchar(100),
@StudentLName varchar(100),
@StudentEmail varchar(100),
@School varchar(100),
@Grade varchar(2),
@City varchar(100),
@State varchar(30),
@Country varchar(50),
@PhoneNumber varchar(100),
@Class char(2),
@MemberType char(1)='S',
@RegistrationUpdate varchar(20)='Registered'
)
AS
BEGIN

	IF @StudentID >0
		BEGIN
			Update AMC_tblStudents 
			Set   colStudentFName =@StudentFName
				  ,colStudentLName =@StudentLName
				  ,colStudentEmail =@StudentEmail
				  ,colStudentSchool=@School
				  ,colStudentGrade =@Grade
				  ,ModifiedDate=getdate()
				 Where 	[colStudentID]=@StudentID
				
			Update [AMC_tblUsers] 
			Set  coluserCity=@City
				 ,coluserPhNo=@PhoneNumber
				 ,coluserState=@State
				 ,coluserCountry=@Country
				 ,ModifiedDate=getdate()
			From 	[AMC_tblUsers] TU  WITH (NOLOCK)
			Inner Join AMC_tblStudents TS  WITH (NOLOCK)
			on TU.coluserID=TS.colParentID
			where   TS.[colStudentID]=@StudentID
 		END

	IF @RegistrationUpdate='Not Registered' 
	BEGIN
		Exec AMC_spRegisterExistingUser @StudentID=@StudentID
	END 

	 
    
END