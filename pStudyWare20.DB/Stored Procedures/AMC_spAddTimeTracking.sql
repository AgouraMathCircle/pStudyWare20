/****** Object:  StoredProcedure [dbo].[AMC_spUpdateSemesterLookup]    Script Date: 23-Jul-20 3:52:31 PM ******/
CREATE PROCEDURE [dbo].[AMC_spAddTimeTracking]
	@LogID int,
	@Username varchar(50) = '',
	@TaskName varchar(50) = '',
	@VolunteerDate Date = '',
	@StartHour char(2), 
	@Startmin char(2), 
	@StartType char(2), 
	@EndHour char(2), 
	@Endmin char(2), 
	@EndType char(2),
	@TaskDescription varchar(100)
AS
BEGIN
	Declare @MemberID int
	Declare @StartTime Time
	Declare @EndTime Time
	Set @StartTime=Convert(time,@StartHour + ':' + @Startmin +' ' + @StartType)  
	Set @EndTime=Convert(time,@EndHour + ':' + @Endmin +' ' + @EndType)

	SELECT	@MemberID = pMemberID FROM MemberMaster WITH (NOLOCK)  
	WHERE	Ltrim(lower(UserName)) = Ltrim(lower(@UserName))
IF @LogID=0
	BEGIN
		INSERT INTO [dbo].[AMC_tblTimeTracking]
				   ([MemberId]
				   ,[TaskName]
				   ,[DateVolunteer]
				   ,[StartTime]
				   ,[EndTime],[TaskDescription])
			 VALUES
				   (@MemberID
				   ,@TaskName 
				   ,@VolunteerDate 
				   ,@StartTime 
				   ,@EndTime ,
				   @TaskDescription
				   )
				   Select scope_identity()
			END 

			

	ELSE
			BEGIN
				Update AMC_tblTimeTracking
					Set TaskName=@TaskName,[DateVolunteer]=@VolunteerDate,[StartTime]=@StartTime,[EndTime]=@EndTime,[TaskDescription]=@TaskDescription
				where LogID=@LogID
			END 

END