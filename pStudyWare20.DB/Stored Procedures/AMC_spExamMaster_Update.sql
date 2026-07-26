Create proc [dbo].[AMC_spExamMaster_Update] 
 @RowID int
,@AnswerKey Char(1)
,@Points int 
AS
BEGIN 

	UPDATE  [dbo].[AMC_ExamMaster]
         Set    [AnswerKey] = @AnswerKey
           ,[Points] =@Points where RowID = @RowID
            
    	  
	 
END