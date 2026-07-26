CREATE PROCEDURE [dbo].[AMC_spSelectExamQuestions] 
 @Class char(2), 
 @ExamType Varchar(20),
 @Session varchar(50)
 AS
BEGIN	 
		 
Declare @CurrentSemester Varchar(5)

Select @CurrentSemester=Semester  from [AMC_tblLookupSemester] with (NOLOCK) 

	
SELECT [Semester]
      ,[Class]
      ,[ExamType]
      ,[Question]
      ,[AnswerKey]
      ,[Points]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[RowID]
      ,[AnswerType]
      ,[Category]
      ,[AnswerDescription]
      ,[mSession]
  FROM [dbo].[AMC_ExamMaster] where [Class] = @Class and [ExamType] =@ExamType and [mSession] =@Session and Semester=@CurrentSemester
				 
 END