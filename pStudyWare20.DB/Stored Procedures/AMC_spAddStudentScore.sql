CREATE PROCEDURE [dbo].[AMC_spAddStudentScore]
  @StudentID int
 ,@Group varchar(100)  =null
 ,@ExamDate Date =null
 ,@QuizTotalScore int = 0
 ,@QuizReceivedScore float
 ,@QuizComments varchar(1000)
 ,@ClassTestTotalScore int = 0
 ,@ClassTestReceivedScore float
 ,@ClassTestComments varchar(1000)
 ,@HomeWorkTotalScore int = 0
 ,@HomeWorkReceivedScore float
 ,@HomeWorkComments varchar(1000)
 ,@FinalExamTotalScore int = 0   
 ,@FinalExamReceivedScore float=0
 ,@FinalExamComments varchar(1000) ='' 
 ,@PlacementTestTotalScore int = 0 
 ,@PlacementTestReceivedScore float =0 
 ,@PlacementTestComments varchar(1000) =''
 ,@Session varchar(30)=null
 AS
BEGIN
		Declare @CurrentSemster Varchar(5)
		Declare @mClass char(2)
		Declare @mSection char(1)
		Declare @iCnt int
		Declare @ChapterID int
		
		Select  @CurrentSemster=semester from AMC_tblLookupSemester WITH (NOLOCK)
		where Active =1



		Select   @ChapterID=ChapterID
				,@mClass=Class
				,@mSection=Section
				,@Group=Case	when CM.Class='AI' Then 'Artificial Intelligence' + ' - ' + CM.Section
								when CM.Class='DS' then 'Data Science' + ' - ' + CM.Section
								when CM.Class='ST' Then 'PSAT' + ' - ' + CM.Section
								when CM.Class='AT' Then 'ACT'
								when CM.Class='GD' Then 'Game Development'
								when CM.Class='JB' then 'Junior Beginner - ' + Section
								when CM.Class='JI' then 'Junior Intermediate - ' + Section
								when CM.Class='JA' then 'Junior Advanced - ' + Section
								when CM.Class='SB' then 'Senior Begineer - ' + Section
								when CM.Class='SI' then 'Senior Intermediate - ' + Section
								when CM.Class='SA' then 'Senior Advanced - ' + Section
						END
				from  AMC_ClassMaster CM WITH (NOLOCK) 
		inner Join [dbo].[AMC_tblStudents] SM WITH (NOLOCK) 
		on CM.StudentID=SM.colStudentID
		Where StudentID=@StudentID

		--and CM.Semester='F21'
	 	----------Getting Current Exam Date Based Chapter and SessionID-------------------------
		if @ExamDate is null or len(@ExamDate)=0
		BEGIN 
			SELECT @ExamDate=ClassDate
			FROM [AMC_ClassSchedule] WITH (NOLOCK)
			Where ChapterID=@ChapterID 
			and Session=substring(@Session, CHARINDEX(' ',@Session)+1,Len(@Session))
			and Semester=substring(@CurrentSemster,1,1) + substring(@CurrentSemster,4,2) 
		END 

		Set @iCnt=0
		Select @iCnt=count(*) from [AMC_tblReportCard] WITH (NOLOCK)
		where mExamDate=@ExamDate and mStudentID=@StudentID

		 if @iCnt>0 
		   Begin 
				Delete from [AMC_tblReportCard] where mExamDate=@ExamDate and mStudentID=@StudentID
		   End 

     		  IF @QuizTotalScore>0 
					BEGIN 
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
							   ,'Quiz'
							   ,@QuizTotalScore 
							   ,@QuizReceivedScore 
							   ,@QuizComments 
							   ,@CurrentSemster
							   ,@mClass
							   ,@mSection
							   ,@ChapterID
							   ,getdate()
							   ,getdate()
						)
					END

				IF @ClassTestTotalScore>0 
				BEGIN 
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
						   ,'Class Test'
						   ,@ClassTestTotalScore 
						   ,@ClassTestReceivedScore   
						   ,@ClassTestComments 
						   ,@CurrentSemster
						   ,@mClass
						   ,@mSection
						   ,@ChapterID
						   ,getdate()
						   ,getdate()
					)
				END

				IF @HomeWorkTotalScore>0 
				BEGIN 
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
						   ,'Home Work'
						   ,@HomeWorkTotalScore 
						   ,@HomeWorkReceivedScore 
						   ,@HomeWorkComments 
						   ,@CurrentSemster
						   ,@mClass
						   ,@mSection
						   ,@ChapterID
						   ,getdate()
						   ,getdate()
					)
				END


				IF @FinalExamTotalScore>0 
				BEGIN 
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
						   ,'Final Exam'
						   ,@FinalExamTotalScore 
						   ,@FinalExamReceivedScore   
						   ,@FinalExamComments 
						   ,@CurrentSemster
						   ,@mClass
						   ,@mSection
						   ,@ChapterID
						   ,getdate()
						   ,getdate()
					)
				END

				IF @PlacementTestTotalScore>0 
				BEGIN 
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
						   ,'Placement Test'
						   ,@PlacementTestTotalScore 
						   ,@PlacementTestReceivedScore  
						   ,@PlacementTestComments 
						   ,@CurrentSemster
						   ,@mClass
						   ,@mSection
						   ,@ChapterID
						   ,getdate()
						   ,getdate()
					)
				END

 END