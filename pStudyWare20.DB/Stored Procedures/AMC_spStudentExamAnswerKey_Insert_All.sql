CREATE PROCEDURE [dbo].[AMC_spStudentExamAnswerKey_Insert_All]
 @StudentID int , 
 @Class char(2),
 @CurrentSemester Varchar(5),
 @ExamType Varchar(20),
 @Session varchar(20),
 @TempTable AS dbo.AMC_tblTypeExamMasterAnswerKey READONLY

 AS
BEGIN	 
	 Declare @iCnt int

	 IF @CurrentSemester is null or len(ltrim(@CurrentSemester))=0
		BEGIN 
			Select @CurrentSemester=semester from AMC_tblLookupSemester with (NOLOCK) 
			Where Active=1
		END 
	 
	Select @iCnt=Count(*) from [AMC_ExamMasterAnswerKey] with (NOLOCK) 
	where StudentID=@StudentID and Semester=@CurrentSemester and [Class] = @Class and [ExamType] =@ExamType and [Session] =@Session 
		
	  IF @iCnt>0 
		    BEGIN
				Delete from [AMC_ExamMasterAnswerKey] 
				where StudentID=@StudentID 
				and Semester=@CurrentSemester 
				and [Class] = @Class 
				and [ExamType] =@ExamType 
				and [Session] =@Session
				 
		    End 

	 -------------Adding the Student Answerkey ------------------------------------
	--INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey],[Session],[ExamType])
	--VALUES (@StudentID,@Class,@CurrentSemester,@Question,@AnswerKey,@Session,@ExamType)
 
	INSERT INTO  [dbo].[AMC_ExamMasterAnswerKey] SELECT * FROM @TempTable 
	------Update 
	EXECUTE  [dbo].[AMC_spValidateStudentExamAnswerKeyALL] @StudentID  ,@Class,@CurrentSemester,@ExamType,@Session 
				 
 END