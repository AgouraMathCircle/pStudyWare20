/****** Object:  StoredProcedure [dbo].[AMC_spUpdateSemesterLookup]    Script Date: 23-Jul-20 3:52:31 PM ******/
CREATE OR ALTER  PROCEDURE [dbo].[AMC_spAddTimeTracking]
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
	@TaskDescription varchar(100),
	@ApprovalStatus char(1)='P'
AS
BEGIN

	------------------------------------Declare -------------------------------------------
	Declare @MemberID int
	Declare @StartTime Time
	Declare @EndTime Time
	Declare @Approved bit
	------------------------------------Settings -------------------------------------------
	Set @StartTime=Convert(time,@StartHour + ':' + @Startmin +' ' + @StartType)  
	Set @EndTime=Convert(time,@EndHour + ':' + @Endmin +' ' + @EndType)

	SELECT	@MemberID = pMemberID FROM MemberMaster WITH (NOLOCK)  
	WHERE	Ltrim(lower(UserName)) = Ltrim(lower(@UserName))

	IF @ApprovalStatus='A'
		BEGIN 
			Set @Approved=1
		END
	ELSE
		BEGIN
		  Set @Approved=0
		END 

IF @LogID=0
			BEGIN
				INSERT INTO [dbo].[AMC_tblTimeTracking]
						   ([MemberId]
						   ,[TaskName]
						   ,[DateVolunteer]
						   ,[StartTime]
						   ,[EndTime]
						   ,[TaskDescription]
						   ,[Approved]
						   ,[ApprovalStatus]
						   )
					 VALUES
						   (@MemberID
						   ,@TaskName 
						   ,@VolunteerDate 
						   ,@StartTime 
						   ,@EndTime
						   ,@TaskDescription
						   ,@Approved
						   ,@ApprovalStatus
						   )
						   Select scope_identity()
			END 
	ELSE
			BEGIN
				Update AMC_tblTimeTracking
					 Set TaskName=@TaskName
					,[DateVolunteer]=@VolunteerDate
					,[StartTime]=@StartTime
					,[EndTime]=@EndTime
					,[TaskDescription]=@TaskDescription
					,[Approved]=@Approved
					,[ApprovalStatus]=@ApprovalStatus
				where LogID=@LogID
			END 

END