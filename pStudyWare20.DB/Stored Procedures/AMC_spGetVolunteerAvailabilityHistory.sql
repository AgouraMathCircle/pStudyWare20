CREATE PROCEDURE [dbo].[AMC_spGetVolunteerAvailabilityHistory]
    @UserID NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        CONVERT(VARCHAR(20), InsertedDate, 106) AS Date,
        Response,
        ISNULL(Comment, '') AS Comment
    FROM dbo.AMC_VolunteerAvailabilityForm
    WHERE UserID = @UserID
    ORDER BY InsertedDate DESC;
END;