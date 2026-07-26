CREATE proc [dbo].[AMC_spSelectStudentProfile] 
(
@StudentID int =0
)
AS
BEGIN
	  
	IF @StudentID >0
		BEGIN
			SELECT TS.[colStudentID]  As StudentID
				  ,TS.[colStudentFName] As StudentFName
				  ,TS.[colStudentLName] As StudentLName
				  ,TS.[colStudentEmail] As StudentEmail
				  ,TS.[colStudentSchool] As School
				  ,TS.[colStudentGrade] As Grade
				  ,TU.[coluserCity] As City
				  ,TU.[coluserState] as State
				  ,TU.[coluserCountry] as Country
				  ,TU.[coluserPhNo] As PhoneNumber
				  ,CM.[Class] as Class
			 				  FROM [AMC_tblUsers] TU WITH (NOLOCK)
							  Inner Join AMC_tblStudents TS  WITH (NOLOCK)
							  on TU.coluserID=TS.colParentID
							  inner join AMC_ClassMaster CM  WITH (NOLOCK)
							  on CM.StudentID=TS.colStudentID
			  where   TS.[colStudentID]=@StudentID
			  
 		END
	 
    
END