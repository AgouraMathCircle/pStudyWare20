CREATE PROCEDURE [dbo].[AMC_spUpdateVolunteerAvailability]
    @UserID NVARCHAR(50),
    @Session NVARCHAR(50),
    @Semester NVARCHAR(50),
    @Response NVARCHAR(10),
    @Comment NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 
        FROM VolunteerAvailabilityForm 
        WHERE UserID = @UserID 
          AND Session = @Session 
          AND Semester = @Semester
    )
    BEGIN
        UPDATE VolunteerAvailabilityForm
        SET 
            Response = @Response,
            Comment = @Comment,
            InsertedDate = GETDATE()
        WHERE 
            UserID = @UserID 
            AND Session = @Session 
            AND Semester = @Semester;
    END
    ELSE
    BEGIN
        INSERT INTO VolunteerAvailabilityForm
        (
            UserID,
            Session,
            Semester,
            Response,
            Comment,
            InsertedDate
        )
        VALUES
        (
            @UserID,
            @Session,
            @Semester,
            @Response,
            @Comment,
            GETDATE()
        );
    END
END;