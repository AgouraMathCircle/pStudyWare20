CREATE proc [dbo].[AMC_spUpdateDocuments] 
 
AS
BEGIN
    Update  AMC_tblDocuments Set Active=1 where Active=0
	
END