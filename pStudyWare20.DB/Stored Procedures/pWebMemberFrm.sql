CREATE PROCEDURE [dbo].[pWebMemberFrm]
	@mode varchar(50)='',
	@firstname varchar(50) = '',
	@lastname varchar(50) = '',
	@emailId varchar(100) = '',
	@MemberType varchar(5) = '',
	@pMemberID int = 0,
	@username varchar(50) = '',
	@password varchar(50) = '',
	@dateofbirth datetime = null,
	@entryid varchar(50)= '',
	@statuscode bit=0,
	@CreditScore int = 0
	
	
AS
BEGIN
	SET NOCOUNT ON;

	-------------------Declare ----------------------------	
	Declare @errorMsg varchar(100);
	Declare @rowCnt int;
	------------------Getting the Password------------------- 	
	IF(@mode = 'GetPassword')
		Begin
			Select [Password],FirstName from MemberMaster WITH (NOLOCK)
			where EmailID = @emailId
			and [Approved]=1
		End
	------------------Getting the MemeberType----------------- 	
	IF(@mode = 'BindddlMemberType')
		BEGIN
				SELECT * FROM	MemberType (NOLOCK)
		END 
	------------------Add New user---------------------------- 	
	IF(@mode = 'AddMember')
		BEGIN
				SELECT	@rowCnt = COUNT(*)
				FROM	MemberMaster (NOLOCK)
				WHERE	EmailID = @emailId
		
				IF(@rowCnt>0)
				BEGIN
					SELECT 'Email ID Already Exist.' As ErrorMsg
				END
				ELSE
				BEGIN
					INSERT INTO MemberMaster
					   (FirstName
					   ,LastName
					   ,UserName
					   ,[Password]
					   ,EmailID
					   ,MemberType
					   ,DateOfBirth
					   ,LastActiveDate
					   ,CreatedBy
					   ,CreatedDate
					   ,Approved)
					VALUES	
					(
					@firstname,
					@lastname,
					@username,
					@password,
					@emailId,
					@MemberType,
					@dateofbirth,
					GETDATE(),
					@entryid,
					GETDATE(),
					@statuscode
					)
			
					SELECT '' As ErrorMsg
				END
		
			End
		------------------Add New AdminUpdateMember--------------------------- 	
		IF(@mode = 'AdminUpdateMember')
			BEGIN
			Update MemberMaster
			set 
			FirstName = @firstname,
			LastName = @lastname,
			UserName = @username,
			[Password] = @password,
			EmailID = @emailId,
			DateOfBirth = @dateofbirth,
			CreditScore = @CreditScore
			where pMemberID = @pMemberID
			END
			IF(@mode = 'AdminAddMember')
			BEGIN
				SELECT	@rowCnt = COUNT(*)
				FROM	MemberMaster (NOLOCK)
				WHERE	EmailID = @emailId
			
				IF(@rowCnt>0)
				BEGIN
					SELECT 'Email ID Already Exist.' As ErrorMsg
				END
				ELSE
				BEGIN
					INSERT INTO MemberMaster
					   (FirstName
					   ,LastName
					   ,UserName
					   ,[Password]
					   ,EmailID
					   ,MemberType
					   ,DateOfBirth
					   ,LastActiveDate
					   ,CreatedBy
					   ,CreatedDate
					   ,Approved)
					VALUES	
					(
					@firstname,
					@lastname,
					@username,
					@password,
					@emailId,
					@MemberType,
					@dateofbirth,
					GETDATE(),
					@entryid,
					GETDATE(),
					@statuscode
					)
				
					insert into MemberReference (fMemberAdminID,fMemberID)
					values (@@IDENTITY,@pMemberID)
				END
				SELECT '' As ErrorMsg
			END
	-----------------ValidateUser------------------------------------------ 		
	IF(@mode = 'ValidateUser')
		BEGIN

				Declare @DueDate datetime
				Declare @CurrentSessionDate Date
				Declare @TodayDate Datetime
				Declare @EnableScoreUpdate char(1)
				Declare @VolunteerAvailability Char(1)
				Declare @CurrentSemester Varchar(30)
				Declare @CurrentSession Varchar(30)
				Declare @TodayDateOnly Date
				-------------------Assig Intial Values------------------	
				Set @TodayDate=getdate()
				Set @TodayDateOnly=getdate()
				Set @EnableScoreUpdate='Y'
				Set @VolunteerAvailability ='N'
				Set @CurrentSession='Session 0'
			
				Select @DueDate =CurrentExamDueTime
				,@VolunteerAvailability=VolunteerAvailability,
				@CurrentSemester=SemesterName,
				@CurrentSessionDate=CurrentExamDate  from [AMC_tblLookupSemester] WITH (NOLOCK) 

			   Select top 1 @CurrentSession=Session from AMC_ClassSchedule where classdate<=@CurrentSessionDate   
			  and chapterID=1 and classdate<@TodayDateOnly  Order by ClassDate desc
				------------------Getting the EnableScoreUpdate--------- 	
				IF @TodayDate>@DueDate
				BEGIN
					Set @EnableScoreUpdate='N'
				END 
				
			
				Select top 1 Username
						,FirstName
						,LastName
						,[Password] 
						,EmailID
						,pMemberID
						,rtrim(MemberType) MemberType
						,ChapterID
						,systemAdmin
						,@EnableScoreUpdate as EnableScoreUpdate
						,@VolunteerAvailability as VolunteerAvailability
						,@CurrentSession as CurrentSession
						,@CurrentSemester as CurrentSemester
				From	MemberMaster  WITH (NOLOCK)
				where upper(ltrim(Username))=upper(ltrim(@emailId))
						and [Password] =@password
						and [Approved]=1
				Order by pMemberID desc
		END 



END