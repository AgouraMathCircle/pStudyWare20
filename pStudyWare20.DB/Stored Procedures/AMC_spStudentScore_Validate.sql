CREATE proc [dbo].[AMC_spStudentScore_Validate] 
 @StudentID int ,
 @Session varchar(20), 
 @Class char(2) ,
 @ExamType Varchar(20),
 @Source Varchar(20)
  
 AS
BEGIN
		Declare @validateCnt int
		Declare @ChapterID int 
		Declare @CurrentSemester char(5)
		Declare @ExamDate Date
		Declare @DueDate Date
		Declare @TodayDate Date
		Set @validateCnt=0
		Set @TodayDate= getdate()
		
		Select @DueDate=CurrentExamDueTime from [AMC_tblLookupSemester] WITH (NOLOCK) 
		
		Select   @CurrentSemester=SM.colStudentEnrolledSession  
				,@ChapterID=SM.ChapterID
		from  AMC_ClassMaster CM WITH (NOLOCK) 
		inner Join [dbo].[AMC_tblStudents] SM WITH (NOLOCK) 
		on CM.StudentID=SM.colStudentID
		Where StudentID=@StudentID and CM.Class=@Class

		SELECT @ExamDate=ClassDate FROM [AMC_ClassSchedule] WITH (NOLOCK)
		Where ChapterID=@ChapterID 
		and Session=substring(@Session, CHARINDEX(' ',@Session)+1,Len(@Session))
		and Semester=substring(@CurrentSemester,1,1) + substring(@CurrentSemester,4,2) 

		
		IF @Source='UpdateScore' and @TodayDate>@DueDate
			 BEGIN
				 SET @validateCnt= 1
			 END 
		ELSE IF @Source='OnlineExam'
			 BEGIN
				SET @validateCnt=0
				Select  @validateCnt=Count(*) from [dbo].[AMC_tblReportCard] with (NOLOCK)
				where mSemster=@CurrentSemester 
				and ChapterID=@ChapterID 
				and mClass=@Class 
				and mType=@ExamType 
				and mExamDate=@ExamDate
				and mStudentID=@StudentID
			 END 

		Select EnableScoreUpdate =Case When @validateCnt=0 then 'Y'
											Else 'N'
									    End 

										 
END