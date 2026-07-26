CREATE proc [dbo].[AMC_spDeleteDocuments] 
(
@Type char(1),
@DocID int =0 
)
AS
BEGIN
 
	IF @DocID >0
		BEGIN
			
			If @Type='S'
			BEGIN 
				Delete from [dbo].[AMC_tblStudentDocuments] where [mDocID]=@DocID
			END 

			If @Type='C'
			BEGIN 
				Delete from [dbo].[AMC_tblDocuments] where [mDocID]=@DocID and Active=0
				Delete from [AMC_tblVideos] where [mDocID]=@DocID
			END 
 		END
	 
    
END