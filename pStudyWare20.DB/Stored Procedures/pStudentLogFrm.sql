CREATE PROCEDURE [dbo].[pStudentLogFrm]
	@mode varchar(50)='',
	@pStudentLogid int = 0,
	@fMemberID int = 0,
	@subject varchar(50) = '3',
	@entrydate datetime = null,
	@starttime datetime = null,
	@endtime datetime = null,
	@chapter varchar(500) ='',
	@Summary varchar(500) = '',
	@Credit int = 0,
	@CreatedBy varchar(50) = ''
AS
BEGIN
	SET NOCOUNT ON;

	IF(@mode = 'GetDropdown')
	BEGIN
		SELECT  *
		FROM	SubjectMaster (NOLOCK)
		Order by [Subject] desc
	END 
	IF(@mode = 'AddLog')
	BEGIN 
	    Set @credit = DATEPART(HOUR, CONVERT(VARCHAR(8), DATEADD(SECOND,DATEDIFF(SECOND,@starttime,@endtime),0), 108));
		INSERT  INTO StudentLog
				(fMemberId
				,[Subject]
				,EntryDate
				,StartTime
				,EndTime
				,Chapter
				,Summary
				,CreatedBy
				,CreatedDate
				,Credit)
		VALUES	(@fMemberID 
				,@subject
				,@entrydate
				,@starttime
				,@endtime
				,@chapter
				,@Summary
				,@CreatedBy
				,GETDATE()
				,@Credit)
				
			Update MemberMaster 
			Set CreditScore = isnull(CreditScore,0) + @Credit
			Where pMemberID = @fMemberID
				
	END 
	if (@mode='GetLogs')
	Begin
	SELECT	StudentLog.[pStudentLogId]
			, StudentLog.[EntryDate]
			, SubjectMaster.[Subject]
			, StudentLog.[StartTime]
			, StudentLog.[EndTime]
			,CONVERT(VARCHAR(8), DATEADD(SECOND,DATEDIFF(SECOND,StudentLog.StartTime,StudentLog.EndTime),0), 108) as TotalHours
			, StudentLog.[Chapter]
			, StudentLog.[Summary]
			, StudentLog.[Credit]
	FROM	StudentLog
			inner join SubjectMaster
				on SubjectMaster.SubjectID  = StudentLog.[Subject]
	WHERE fMemberId=@fMemberID
	Order by [EntryDate] desc
	End
	if (@mode ='UpdateLog')
	Begin
		Declare @oldCredit int;
		Set @credit = DATEPART(HOUR, CONVERT(VARCHAR(8), DATEADD(SECOND,DATEDIFF(SECOND,@starttime,@endtime),0), 108));
		
		Select	@oldCredit = Credit 
		From	StudentLog
		Where	pStudentLogId = @pStudentLogid	
		
		Update MemberMaster 
		Set CreditScore = isnull(CreditScore,0) - @oldCredit
		Where pMemberID in (Select fMemberId from StudentLog where pStudentLogId = @pStudentLogid)		
		
	
		UPDATE	StudentLog
		SET		EntryDate =@entrydate
				,[Subject] =@subject 
				,StartTime =@starttime
				, EndTime = @endtime
				,Chapter =@chapter
				,Summary =@Summary
				,Credit = @credit		
		WHERE	pStudentLogId = @pStudentLogid	
		
		Update MemberMaster 
		Set CreditScore = isnull(CreditScore,0) + @credit
		Where pMemberID in (Select fMemberId from StudentLog where pStudentLogId = @pStudentLogid)		
		
			
	End
	if (@mode = 'UpdateLogAndCredit')
	Begin
		UPDATE	StudentLog
		SET			EntryDate =@entrydate
		,[Subject] =@subject 
		,StartTime =@starttime
		, EndTime = @endtime
		,Chapter =@chapter
		,Summary =@Summary	
	    ,Credit = @Credit
		WHERE	pStudentLogId = @pStudentLogid
		
				
		Update MemberMaster 
		Set CreditScore = isnull(CreditScore,0) + @Credit
		Where pMemberID in (Select fMemberId from StudentLog where pStudentLogId = @pStudentLogid)		
		
	End
	if (@mode ='DeleteLog')
	Begin
	Delete from StudentLog
		WHERE pStudentLogId = @pStudentLogid
	End
	
	if (@mode ='GetRow')
     Begin
     Select * From StudentLog
     where pStudentLogId =@pStudentLogid
     
     
     Select CreditScore From MemberMaster 
     where pMemberID in(Select fMemberId from StudentLog where pStudentLogId = @pStudentLogid)
     End

END