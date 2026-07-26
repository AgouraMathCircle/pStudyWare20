CREATE PROCEDURE [dbo].[AMC_spAddVolunteerAvailability]
    @UserID NVARCHAR(50),
    @Session NVARCHAR(50),
    @Semester NVARCHAR(50),
    @Response NVARCHAR(10),
    @Comment NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 
        FROM dbo.AMC_VolunteerAvailabilityForm
        WHERE UserID = @UserID 
          AND Session = @Session 
          AND Semester = @Semester
    )
    BEGIN
        UPDATE dbo.AMC_VolunteerAvailabilityForm
        SET Response = @Response,
            Comment = @Comment
        WHERE UserID = @UserID 
          AND Session = @Session 
          AND Semester = @Semester;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.AMC_VolunteerAvailabilityForm
            (UserID, Session, Semester, Response, Comment)
        VALUES
            (@UserID, @Session, @Semester, @Response, @Comment);
    END
END;