CREATE PROCEDURE [dbo].[pStdentReports]
	@mode varchar(50)='',
	@pMemberId int = 0,
	@startdate datetime = null,
	@enddate datetime = null
	
AS
BEGIN
	SET NOCOUNT ON;
	Declare @userType varchar(5);
	
	
	
	if (@mode='GetLogs')
	Begin
		SELECT	@userType = MemberMaster.MemberType
		FROM	MemberMaster (NOLOCK)
		WHERE	pMemberID = @pMemberId
		
		IF(@userType = 'A')  -- Report for Admin
		BEGIN
			SELECT	 MemberMaster.FirstName
					, StudentLog.[EntryDate]
					, SubjectMaster.[Subject]
					, StudentLog.StartTime
					, StudentLog.[EndTime]
					,CONVERT(VARCHAR(8), DATEADD(SECOND,DATEDIFF(SECOND,StudentLog.StartTime,StudentLog.EndTime),0), 108) as TotalHours
					,StudentLog.Chapter
					, StudentLog.[Credit]					
			FROM	StudentLog
					inner join SubjectMaster
						on SubjectMaster.SubjectID  = StudentLog.[Subject]
					inner join MemberMaster (NOLOCK)
						On StudentLog.fMemberId = MemberMaster.pMemberID
			WHERE	StudentLog.fMemberId in (Select fMemberID From dbo.MemberReference (NOLOCK) Where fMemberAdminID = @pMemberId )
					And EntryDate between @startdate and @enddate
			Order by MemberMaster.FirstName,StudentLog.EntryDate desc
		END
		ELSE IF(@userType = 'U') -- Report for Users
		BEGIN
			SELECT	 MemberMaster.FirstName
					, StudentLog.[EntryDate]
					, SubjectMaster.[Subject]
					, StudentLog.StartTime
					, StudentLog.[EndTime]
					,CONVERT(VARCHAR(8), DATEADD(SECOND,DATEDIFF(SECOND,StudentLog.StartTime,StudentLog.EndTime),0), 108) as TotalHours
					,StudentLog.Chapter
					, StudentLog.[Credit]
					FROM	StudentLog
					inner join SubjectMaster
						on SubjectMaster.SubjectID  = StudentLog.[Subject]
					inner join MemberMaster (NOLOCK)
						On StudentLog.fMemberId = MemberMaster.pMemberID
			WHERE fMemberId=@pMemberId and EntryDate between @startdate and @enddate
			Order by EntryDate desc
		END
	End
	
END