Create proc [dbo].[AMC_spVolunteersRequest_Delete]
 @RequestID int
AS
BEGIN

	IF @RequestID>0 
		BEGIN
			Delete from [AMC_tblVolunteersRequest] Where  RequestID = @RequestID
		END 
END