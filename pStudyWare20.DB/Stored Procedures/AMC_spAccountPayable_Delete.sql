CREATE proc [dbo].[AMC_spAccountPayable_Delete] 
 @ApID int
AS
BEGIN

	IF @ApID>0 
		BEGIN
			Delete from [AMC_tblAccountPayable]
			Where ApID=@ApID
		END 
END