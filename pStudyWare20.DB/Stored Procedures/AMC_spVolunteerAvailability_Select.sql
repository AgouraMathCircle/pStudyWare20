CREATE PROCEDURE [dbo].[AMC_spVolunteerAvailability_Select]
   @UserID int,
    @Session  varchar(20),
    @Semester varchar(5)
AS
BEGIN
	declare @ExtCnt int
	
	Set @ExtCnt=0

	Select @ExtCnt=Count(*) from dbo.AMC_VolunteerAvailability with (NOLOCK) 
	Where UserID = @UserID  AND Session = rtrim(@Session)  AND Semester = @Semester

    IF @ExtCnt>0
		BEGIN
			Select Response
			, Comments from AMC_VolunteerAvailability with (NOLOCK)
			WHERE UserID = @UserID 
			AND Session = rtrim(@Session) AND Semester = @Semester;
		END
    ELSE
		BEGIN	
			Select 0
		END
END