CREATE proc [dbo].[AMC_spExamMaster_Insert] 
 @Class Char(2)
,@ExamType Varchar(50)
,@Question int
,@AnswerKey Char(1)
,@Points int
,@AnswerType Char(1)
,@Category varchar(30)
,@AnswerDescription varchar(100)
,@mSession varchar(30)
,@CreatedBy varchar(50)
AS
BEGIN

	Declare @Currentsemester varchar(5)
	Select @Currentsemester= semester from [dbo].[AMC_tblLookupSemester] 
	WITH (NOLOCK) Where Active=1

	IF @Question>0
	BEGIN
		Delete from [AMC_ExamMaster] 
		where Semester=@Currentsemester 
		and Class=@Class 
		and ExamType=@ExamType 
		and Question=@Question  
		and mSession=@mSession
		and AnswerType=@AnswerType

		INSERT INTO [dbo].[AMC_ExamMaster]
			   ([Semester]
			   ,[Class]
			   ,[ExamType]
			   ,[Question]
			   ,[AnswerKey]
			   ,[Points]
			   ,[AnswerType]
			   ,[Category]
			   ,[AnswerDescription]
			   ,[mSession]
			   ,[CreatedBy]
			   ,[CreatedDate]
    		   )
		Values(
				@Currentsemester
			   ,@Class
			   ,@ExamType
			   ,@Question
			   ,@AnswerKey
			   ,@Points
			   ,@AnswerType
			   ,@Category
			   ,@AnswerDescription
			   ,@mSession
			   ,@CreatedBy
			   ,getdate()
		)
	END 
END