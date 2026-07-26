CREATE proc [dbo].[AMC_spRegisterednfo] 
@StudentID int
AS
	BEGIN
		Declare @Upcomingsemester varchar(5)
		Declare @SemesterName varchar(30)
		Select @Upcomingsemester=semester,@SemesterName=SemesterName  from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK)
		 Where Active=1
		
			 SELECT TS.[colStudentID]  As StudentID
			  ,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
			  ,TS.[colStudentSchool] As School
			  ,CL.Class + ' - ' + CL.Section As Grade 
			  ,TS.colStudentEnrolledSession As Semester
			  ,EventLocation =Case when  TS.[ColEventLocation]='O' Then CM.Name + ' - On Site (' +  CM.Location + ')'  
									when  TS.[ColEventLocation]='I' Then CM.Name +'- Internet'  
								END 
			 ,@SemesterName as SemesterName
								  FROM  AMC_tblStudents TS  WITH (NOLOCK)
								  inner join AMC_tblRegistration RU WITH (NOLOCK)
								  on TS.colStudentID=RU.StudentID
								  and TS.colStudentEnrolledSession=RU.Semester		
								  inner Join AMC_ChapterMaster CM with (NOLOCK)	
								  on CM.ChapterID=TS.ChapterID
								  inner Join AMC_ClassMaster CL WITH (NOLOCK)
								  on CL.StudentID=TS.colStudentID
								  where  TS.colStudentID=@StudentID
				  and TS.colStudentEnrolledSession=@Upcomingsemester

	END