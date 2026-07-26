CREATE proc [dbo].[AMC_spExamMaster_Delete] 
@QuestionID int
AS
BEGIN
	Delete from [dbo].[AMC_ExamMaster] where RowID=@QuestionID
END