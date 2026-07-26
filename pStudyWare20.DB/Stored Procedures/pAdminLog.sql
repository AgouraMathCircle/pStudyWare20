CREATE PROCEDURE [dbo].[pAdminLog]
	@mode varchar(50)='',
	@pMemberId int = 0, 
	@SearchName varchar(50) = ''
	
AS
BEGIN
	SET NOCOUNT ON;
	if (@mode = 'BindDropDownList')
	Begin
		Select	MemberReference.fMemberID
				,MemberMaster.FirstName  
		From	MemberReference 
				inner join MemberMaster
					on MemberMaster.pMemberID = MemberReference.fMemberID
		where	fMemberAdminID = @pMemberId
	End
	if (@mode='GetLogs')
	Begin
			SELECT	 MemberMaster.FirstName
					, StudentLog.[EntryDate]
					, SubjectMaster.[Subject]
					, StudentLog.StartTime
					, StudentLog.[EndTime]
					,StudentLog.pStudentLogId
					,StudentLog.Summary
					,StudentLog.Chapter
					,CONVERT(VARCHAR(8), DATEADD(SECOND,DATEDIFF(SECOND,StudentLog.StartTime,StudentLog.EndTime),0), 108) as TotalHours
					,StudentLog.Chapter
					, StudentLog.[Credit]					
			FROM	StudentLog
					inner join SubjectMaster
						on SubjectMaster.SubjectID  = StudentLog.[Subject]
					inner join MemberMaster (NOLOCK)
						On StudentLog.fMemberId = MemberMaster.pMemberID
			WHERE	StudentLog.fMemberId in (Select fMemberID From dbo.MemberReference (NOLOCK) Where fMemberAdminID =@pMemberId )
					And FirstName Like Case @SearchName When '' Then '%' Else @SearchName End
			Order by MemberMaster.FirstName,StudentLog.EntryDate desc
	End
	
END