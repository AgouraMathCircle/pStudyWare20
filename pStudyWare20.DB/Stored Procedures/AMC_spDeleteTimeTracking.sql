CREATE proc [dbo].[AMC_spDeleteTimeTracking] 
(
	@LogID int =0 
)
AS
BEGIN
 
	IF @LogID >0
		BEGIN
			Delete from [dbo].[AMC_tblTimeTracking] where [LogID]=@LogID
		END	
	 
    
END