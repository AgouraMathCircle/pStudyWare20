CREATE PROCEDURE [dbo].[AMC_spAddStudentExamAnswerKey]
 @StudentID int
,@sQuestion1Answerkey char(1) ='N'
,@sQuestion2Answerkey char(1) ='N'
,@sQuestion3Answerkey char(1) ='N'
,@sQuestion4Answerkey char(1) ='N'
,@sQuestion5Answerkey char(1) ='N'
,@sQuestion6Answerkey char(1) ='N'
,@sQuestion7Answerkey char(1) ='N'
,@sQuestion8Answerkey char(1) ='N'
,@sQuestion9Answerkey char(1) ='N'
,@sQuestion10Answerkey char(1) ='N'
,@sQuestion11Answerkey char(1) ='N'
,@sQuestion12Answerkey char(1) ='N'
,@sQuestion13Answerkey char(1) ='N'
,@sQuestion14Answerkey char(1) ='N'
,@sQuestion15Answerkey char(1) ='N'
,@sQuestion16Answerkey char(1) ='N'
,@sQuestion17Answerkey char(1) ='N'
,@sQuestion18Answerkey char(1) ='N'
,@sQuestion19Answerkey char(1) ='N'
,@sQuestion20Answerkey char(1) ='N' 
,@sQuestion21Answerkey char(1) ='N'
,@sQuestion22Answerkey char(1) ='N'
,@sQuestion23Answerkey char(1) ='N'
,@sQuestion24Answerkey char(1) ='N'
,@sQuestion25Answerkey char(1) ='N'
,@sQuestion26Answerkey char(1) ='N'
 AS
BEGIN
		Declare @CurrentSemster Varchar(5)
		Declare @mClass char(2)
		Declare @mSection char(1)
		Declare @iCnt int
		Declare @ExamDate Date
		Declare @ChapterID int
		Declare @Group varchar(30)
		Declare @FinalExamTotalScore int
	    Declare @FinalExamReceivedScore  int  
		Declare @FinalExamComments varchar(50)
		Declare @StudentName varchar(50)
		

		Set @FinalExamTotalScore=100
		
		Select  @CurrentSemster=semester,@ExamDate=CurrentExamDate from AMC_tblLookupSemester WITH (NOLOCK)
		where Active =1
	 
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
								when @mClass='DS' then 'Data Science - ' + Section
								when @mClass='AI' then 'Artificial Intelligence - ' + Section
								when @mClass='ST' then 'PSAT - ' + Section
								when @mClass='AT' then 'ACT - ' + Section
						END
				from  AMC_ClassMaster CM WITH (NOLOCK) 
		inner Join [dbo].[AMC_tblStudents] SM WITH (NOLOCK) 
		on CM.StudentID=SM.colStudentID
		Where StudentID=@StudentID

		Set @iCnt=0
		Select @iCnt=count(*) from [AMC_tblReportCard] WITH (NOLOCK)
		where mExamDate=@ExamDate and mStudentID=@StudentID

		 IF  @iCnt>0 
		    BEGIN
				Delete from [AMC_tblReportCard] where mExamDate=@ExamDate and mStudentID=@StudentID
				Delete from [AMC_ExamMasterAnswerKey] where StudentID=@StudentID and Semester=@CurrentSemster 
		    End 
		 ELSE
			BEGIN 
				-------------Adding the Student Answerkey ------------------------------------
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,1,@sQuestion1Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,2,@sQuestion2Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,3,@sQuestion3Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,4,@sQuestion4Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,5,@sQuestion5Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,6,@sQuestion6Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,7,@sQuestion7Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,8,@sQuestion8Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,9,@sQuestion9Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,10,@sQuestion10Answerkey)
	
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,11,@sQuestion11Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,12,@sQuestion12Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,13,@sQuestion13Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,14,@sQuestion14Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,15,@sQuestion15Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,16,@sQuestion16Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,17,@sQuestion17Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,18,@sQuestion18Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,19,@sQuestion19Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,20,@sQuestion20Answerkey)

				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,21,@sQuestion21Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,22,@sQuestion22Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,23,@sQuestion23Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,24,@sQuestion24Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,25,@sQuestion25Answerkey)
				INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey])VALUES (@StudentID,@mClass,@CurrentSemster,26,@sQuestion26Answerkey)
		
				------ Checkling the Answer-----------------------------------------
				Update [AMC_ExamMasterAnswerKey] Set Points=EM.Points
				From [AMC_ExamMasterAnswerKey]  AK WITH (NOLOCK)
				Inner Join AMC_ExamMaster EM WITH (NOLOCK)
				on EM.Question=AK.Question
				and EM.AnswerKey=AK.AnswerKey
				and EM.Class=AK.Class
				and EM.Semester=AK.Semester
 
				Select @FinalExamReceivedScore=Sum(Points) from  [AMC_ExamMasterAnswerKey] WITH (NOLOCK)
				Where StudentID=@StudentID and Semester=@CurrentSemster

				Set @FinalExamComments= case when @FinalExamReceivedScore>90 then 'Excellent Job.'
											 when @FinalExamReceivedScore between 75 and 90 then 'Good Job.'	
											 When @FinalExamReceivedScore between 60 and 75 then 'Nice Job.'
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
 

			Select 
				  @StudentName AS StudentName
				 ,@Group AS Class 
				 ,CurrentSemster 
				 =Case when substring(@CurrentSemster,1,1)='S' then 'Spring ' +  substring(@CurrentSemster,2,4)
					 when substring(@CurrentSemster,1,1)='F' then 'Fall  ' +  substring(@CurrentSemster,2,4)
						End 
				 ,CONVERT(CHAR(10),@ExamDate, 101) AS ExamDate
				 ,@FinalExamTotalScore AS FinalExamTotalScore
				 ,@FinalExamReceivedScore AS FinalExamReceivedScore
				 ,@FinalExamComments AS Comments 
 END