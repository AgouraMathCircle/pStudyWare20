CREATE PROCEDURE [dbo].[AMC_spValidateStudentExamAnswerKeyALL]
 @StudentID int,
 @Class char(2),
 @mCurrentSemester Varchar(5),
 @ExamType Varchar(20),
 @Session varchar(20)
 AS
BEGIN
		Declare @mClass char(2)
		Declare @mSection char(1)
		Declare @iCnt int
		Declare @ExamDate Date
		Declare @ChapterID int 
		Declare @Group varchar(30)
		Declare @FinalExamTotalScore int
	    Declare @FinalExamReceivedScore  int  
		Declare @FinalExamComments varchar(100)
		Declare @StudentName varchar(50)
		set @FinalExamTotalScore=0
		Set @FinalExamReceivedScore=0
		
		Set @ExamType=rtrim(@ExamType)

		if @mCurrentSemester is null or len(@mCurrentSemester)=0
		BEGIN 
			Select @mCurrentSemester=semester from AMC_tblLookupSemester with (NOLOCK) 
			Where Active=1
		END 

		select @FinalExamTotalScore = sum(points) from AMC_ExamMaster With (NOLOCK) 
		where  class =@Class and examtype=@ExamType and [msession]=@Session and Semester=@mCurrentSemester
	 
		Select   @StudentName =SM.colStudentFName + ' '+  SM.colStudentLName
				,@ChapterID=ChapterID
				,@mClass=Class
				,@mSection=Section
				,@Group=Case	when @mClass='JB' then 'Junior Beginner - ' + Section
								when @mClass='JI' then 'Junior Intermediate - ' + Section
								when @mClass='JA' then 'Junior Advanced - ' + Section
								when @mClass='SB' then 'Senior Beginner - ' + Section
								when @mClass='SI' then 'Senior Intermediate - ' + Section
								when @mClass='SA' then 'Senior Advanced - ' + Section
								when @mClass='DS' then 'Data Science'
								when @mClass='AI' then 'Artificial Intelligence'
								when @mClass='ST' then 'PSAT' 
								when @mClass='AT' then 'ACT'
						END
		from  AMC_ClassMaster CM WITH (NOLOCK) 
		inner Join [dbo].[AMC_tblStudents] SM WITH (NOLOCK) 
		on CM.StudentID=SM.colStudentID
		Where StudentID=@StudentID

		 ------ Checkling the Answer-----------------------------------------
				Update [AMC_ExamMasterAnswerKey] Set Points=EM.Points
				From [AMC_ExamMasterAnswerKey]  AK WITH (NOLOCK)
				Inner Join AMC_ExamMaster EM WITH (NOLOCK)
				on EM.Question=AK.Question
				and EM.AnswerKey=AK.AnswerKey
				and EM.Class=AK.Class
				and EM.Semester=AK.Semester
				and EM.ExamType = AK.ExamType
				and EM.[mSession] = AK.[Session]
				Where AK.StudentID=@StudentID
				 
 
				Select @FinalExamReceivedScore=Sum(Points) from  [AMC_ExamMasterAnswerKey] WITH (NOLOCK)
				Where StudentID=@StudentID and Semester=@mCurrentSemester and  [Class] = @Class and [ExamType] =@ExamType and [Session] =@Session

				--Convert to Percentage
				 Declare @Precentage float

				 set @Precentage = (cast(@FinalExamReceivedScore as  float)/ cast(@FinalExamTotalScore as  float))*100
				----------Getting Current Exam Date Based Chapter and SessionID-------------------------
				SELECT @ExamDate=ClassDate
				FROM [AMC_ClassSchedule] WITH (NOLOCK)
				Where ChapterID=@ChapterID 
				and Session=substring(@Session, CHARINDEX(' ',@Session)+1,Len(@Session))
				and Semester=substring(@mCurrentSemester,1,1) + substring(@mCurrentSemester,4,2) 

	
				
				Set @FinalExamComments= case when @Precentage>90.00 then 'Excellent Job.'
											 when @Precentage between 75.00 and 90.00 then 'Good Job.'	
											 When @Precentage between 60.00 and 75.00 then 'Nice Job.'
											else 'Good Try. Practice more.'	
										End 
				
				
				INSERT INTO [dbo].[AMC_tblReportCard]
						   ([mStudentID]
						   ,[mGroup]
						   ,[mExamDate]
						   ,[mType]
						   ,[mTotalPoints]
						   ,[mReceivedPoints]
						   ,[mComments]
						   ,[mSemster]
						   ,[mClass]
						   ,[mSection]
						   ,[ChapterID]
						   ,[InsertDate]
						   ,[ModifiedDate])
					 VALUES
						   (@StudentID
						   ,@Group
						   ,@ExamDate
						   ,@ExamType
						   ,@FinalExamTotalScore 
						   ,@FinalExamReceivedScore   
						   ,@FinalExamComments 
						   ,@mCurrentSemester
						   ,@Class
						   ,@mSection
						   ,@ChapterID
						   ,getdate()
						   ,getdate()
					)				
 
			Update AMC_tblStudents set RegistrationPriority=1 where colStudentID=@StudentID
		
			Select 
				  @StudentName AS StudentName
				 ,@Group AS Class 
				 ,CurrentSemster 
				 =Case when substring(@mCurrentSemester,1,1)='S' then 'Spring ' +  substring(@mCurrentSemester,2,4)
					 when substring(@mCurrentSemester,1,1)='F' then 'Fall  ' +  substring(@mCurrentSemester,2,4)
						End 
				 ,Convert( Varchar(10),@ExamDate, 101 ) ExamDate
				 ,@FinalExamTotalScore AS FinalExamTotalScore
				 ,@FinalExamReceivedScore AS FinalExamReceivedScore
				 ,@FinalExamComments AS Comments
				 ,@Session AS CurrentSession 
 END