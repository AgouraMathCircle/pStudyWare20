Create procedure [dbo].[AMC_spUpdateStudentdetail] 
(
@StudentID int =0, 
@School varchar(100),
@Grade varchar(2),
@City varchar(100),
@State varchar(30),
@Country varchar(50),
@PhoneNumber varchar(100)
 
)
AS
BEGIN
 
	IF @StudentID >0
		BEGIN
			
			Update AMC_tblStudents 
			Set colStudentSchool=@School
				  ,colStudentGrade =@Grade
				 Where 	[colStudentID]=@StudentID
				
			Update [AMC_tblUsers] 
			Set  coluserCity=@City
				 ,coluserPhNo=@PhoneNumber
				 ,coluserState=@State
				 ,coluserCountry=@Country
			From 	[AMC_tblUsers] TU  WITH (NOLOCK)
			Inner Join AMC_tblStudents TS  WITH (NOLOCK)
			on TU.coluserID=TS.colParentID
			where   TS.[colStudentID]=@StudentID
 		END
	 
    
END