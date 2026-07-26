CREATE PROCEDURE [dbo].[AMC_spDeleteSpecialEventsRegistration]
    @RequestID int
AS 
	 BEGIN
			Delete from [dbo].[AMC_tblSpecialEventsRegistration] where RequestID=@RequestID
	END