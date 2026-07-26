CREATE proc [dbo].[AMC_spUpdateStudentClass] 
(
@StudentID int =0,
@Class char(2), 
@Section char(1), 
@ChapterID int,
@Location char(1),
@Session char(5)
)
AS
BEGIN
 
	IF @StudentID >0
		BEGIN
			
			Declare @UserName varchar(100)
			Declare @CurrentSemester varchar(5)
			
			Select @UserName=TU.coluserEmail,@CurrentSemester=TS.colStudentEnrolledSession from AMC_tblUsers TU WITH (NOLOCK)
			inner Join [dbo].[AMC_tblStudents] TS WITH (NOLOCK)
			on TU.[coluserID]=TS.colParentID
			where TS.colStudentID=@StudentID

		    Update  AMC_ClassMaster Set Class=@Class,Section=@Section,Semester=Substring(@Session,1,1) + Substring(@Session,4,2)
			Where StudentID=@StudentID
			
			Update  AMC_tblStudents 
			Set ChapterID=@ChapterID
			,ColEventLocation=@Location
			,colStudentEnrolledSession=@Session
			Where colStudentID=@StudentID
						
			Update MemberMaster Set Approved=1 
			Where upper(ltrim(Username))=upper(ltrim(@Username))

			IF @CurrentSemester<>@Session
			  BEGIN 
				delete  from AMC_tblRegistration where StudentID=@StudentID
				and Semester=@CurrentSemester
			  END 

	 	END
	 
    
END