CREATE PROCEDURE [dbo].[AMC_spDeleteExistingReport]
 @StudentID int ,
  @Class char(2), 
 @ExamType Varchar(20),
 @Session varchar(50)
 AS
BEGIN
		Declare @CurrentSemster Varchar(5)		 
		Declare @iCnt int
	    Declare @ChapterID int 
		Declare @CurrentSemester char(5)
		Declare  @ExamDate Date
		
		Select   @CurrentSemester=SM.colStudentEnrolledSession  
				,@ChapterID=SM.ChapterID
		from  AMC_ClassMaster CM WITH (NOLOCK) 
		inner Join [dbo].[AMC_tblStudents] SM WITH (NOLOCK) 
		on CM.StudentID=SM.colStudentID
		Where StudentID=@StudentID and CM.Class=@Class

		SELECT @ExamDate=ClassDate
		FROM [AMC_ClassSchedule] WITH (NOLOCK)
		Where ChapterID=@ChapterID 
		and Session=substring(@Session,6,Len(@Session)) 
		and Semester=substring(@CurrentSemester,1,1) + substring(@CurrentSemester,4,2) 

		Set @iCnt=0
		Select @iCnt=count(*) from [AMC_tblReportCard] WITH (NOLOCK)
		where mExamDate=@ExamDate and mStudentID=@StudentID and mClass=@Class and mType=@ExamType and ChapterID=@ChapterID

		 IF  @iCnt>0 
		    BEGIN
				Delete from [AMC_tblReportCard] Where mExamDate=@ExamDate and mStudentID=@StudentID and mClass=@Class and mType=@ExamType and ChapterID=@ChapterID
				Delete from [AMC_ExamMasterAnswerKey] where StudentID=@StudentID and Semester=@CurrentSemster and [Class] = @Class and [ExamType] =@ExamType and [Session] =@Session
		    End 

		Set @iCnt=0
		Select @iCnt=count(*) from [AMC_ExamMasterAnswerKey] WITH (NOLOCK)
		where StudentID=@StudentID and class =@Class and examtype=@ExamType and [session]=@Session and Semester=@CurrentSemster
		
		IF  @iCnt>0 
		 BEGIN				 
				Delete from [AMC_ExamMasterAnswerKey] where StudentID=@StudentID and Semester=@CurrentSemster and [Class] = @Class and [ExamType] =@ExamType and [Session] =@Session
		 End 

		Select @CurrentSemester as CurrentSemester,@ExamDate as ExamDate,@Class as Class
		
 END