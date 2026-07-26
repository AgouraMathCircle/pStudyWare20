CREATE  PROCEDURE [dbo].[AMC_spVolunteerAvailability_Update]
    @UserID int,
    @Session varchar(20),
    @Semester varchar(5),
    @Response varchar(1),
    @Comments varchar(300) = NULL
AS
BEGIN

	Declare @ExtCnt int
	Declare @ChapterID int
	Declare @Class Char(2)
	
	Set @ExtCnt=0

	Select @ChapterID=ChapterID,@Class=Class from dbo.AMC_InstructorMaster with (NOLOCK) 
	Where InstructorID = @UserID 


	Select @ExtCnt=Count(*) from dbo.AMC_VolunteerAvailability with (NOLOCK) 
	Where UserID = @UserID  AND Session = @Session  AND Semester = @Semester

    IF @ExtCnt>0
		BEGIN
			UPDATE dbo.AMC_VolunteerAvailability
			SET Response = @Response,
				ChapterID=@ChapterID,
				Class=@Class,
				Comments = @Comments,
				UpdatedDate = GETDATE()
			WHERE UserID = @UserID  AND Session = @Session AND Semester = @Semester;
		END
    ELSE
		BEGIN
			INSERT INTO dbo.AMC_VolunteerAvailability
				(UserID
				,ChapterID
				,Class
				,Session 
				,Semester 
				,Response 
				,Comments)
			VALUES
				(@UserID
				,@chapterID
				,@Class
				,@Session
				,@Semester
				,@Response
				,@Comments)

		END
END