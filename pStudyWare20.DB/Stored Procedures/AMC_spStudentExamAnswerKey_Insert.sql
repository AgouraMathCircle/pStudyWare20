CREATE PROCEDURE [dbo].[AMC_spStudentExamAnswerKey_Insert]
 @StudentID int ,
 @AnswerKey char(1) ='N',
 @Question int,
 @Class char(2),
 @CurrentSemester Varchar(5),
 @ExamType Varchar(20),
 @Session varchar(20)
 AS
BEGIN	 
	 Declare @iCnt int

	 IF @CurrentSemester is null or len(ltrim(@CurrentSemester))=0
		BEGIN 
			Select @CurrentSemester=semester from AMC_tblLookupSemester with (NOLOCK) 
			Where Active=1
		END 
	 
	Select @iCnt=Count(*) from [AMC_ExamMasterAnswerKey] 
	where StudentID=@StudentID and Semester=@CurrentSemester and [Class] = @Class and [ExamType] =@ExamType and [Session] =@Session and Question=@Question
		
	  IF @iCnt>0 
		    BEGIN
				Delete from [AMC_ExamMasterAnswerKey] 
				where StudentID=@StudentID 
				and Semester=@CurrentSemester 
				and [Class] = @Class 
				and [ExamType] =@ExamType 
				and [Session] =@Session
				and Question=@Question
		    End 
	-------------Adding the Student Answerkey ------------------------------------
	INSERT INTO [dbo].[AMC_ExamMasterAnswerKey]([StudentID],[Class],[Semester],[Question],[AnswerKey],[Session],[ExamType])
	VALUES (@StudentID,@Class,@CurrentSemester,@Question,@AnswerKey,@Session,@ExamType)
				 
 END