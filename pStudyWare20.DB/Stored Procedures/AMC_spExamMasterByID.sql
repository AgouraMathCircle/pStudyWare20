CREATE proc [dbo].[AMC_spExamMasterByID] 
@QuestionID int

AS
BEGIN
 

Select [RowID] as QuestionID
 		  ,[Semester]
		  ,[Class]
		  ,[ExamType]
		  ,mSession    
		  ,[Question]
		  ,AnswerType=Case When [AnswerType]='M' then 'Mutiple Choice'
				When [AnswerType]='S' then 'Short Answer'
				When [AnswerType]='E' then 'Essay'
				When [AnswerType]='F' then 'Free Style'
				END 
		  ,[AnswerKey]
		  ,[AnswerDescription]
		  ,[Points]		 
		  ,[Category]
		  ,[CreatedDate] from [dbo].[AMC_ExamMaster] with (NOLOCK) 
		  where [RowID] = @QuestionID


END