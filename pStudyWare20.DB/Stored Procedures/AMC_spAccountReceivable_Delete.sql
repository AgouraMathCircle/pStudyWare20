CREATE proc [dbo].[AMC_spAccountReceivable_Delete] 
 @ArID int
AS
BEGIN

	IF @ArID>0 
		BEGIN
			Delete from [AMC_tblAccountReceivable]
			Where ArID=@ArID
		END 
END