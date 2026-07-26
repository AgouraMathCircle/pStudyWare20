CREATE proc [dbo].[AMC_spSelectClassListbyInstructor] 
@Username varchar(100) 
AS
BEGIN


	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @ChapterID int
	Declare @ClassAccess char(1)

	Select @sUserType=MemberType,@iUserID=pMemberID,@ChapterID=ChapterID,@ClassAccess=ClassAccess from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	Declare @Currentsemester varchar(5)
	Select @Currentsemester= semester from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) Where Active=1

	IF @sUserType='I' and  @ClassAccess='A'
		BEGIN 
			Select Ltrim(Rtrim(CT.ClassName)) + ' - ' + CT.Section AS ClassName
			, CT.StudentEmailGroup StudentEmailGroup
			, CT.InstructorEmailGroup InstructorEmailGroup  from [dbo].[AMC_ClassType] CT WITH (NOLOCK)
			inner join [dbo].[AMC_InstructorMaster] IM  WITH (NOLOCK)
			on CT.Class=IM.Class
			--and CT.Section=IM.Section
			where IM.InstructorID=@iUserID
			and IM.ChapterID=@ChapterID
		END 

	ELSE IF @sUserType='I'  and @ClassAccess='N'
		BEGIN 
			Select Ltrim(Rtrim(CT.ClassName)) + ' - ' + CT.Section AS ClassName
			, CT.StudentEmailGroup StudentEmailGroup
			, CT.InstructorEmailGroup InstructorEmailGroup  from [dbo].[AMC_ClassType] CT WITH (NOLOCK)
			inner join [dbo].[AMC_InstructorMaster] IM  WITH (NOLOCK)
			on CT.Class=IM.Class
			and CT.Section=IM.Section
			where IM.InstructorID=@iUserID
			and IM.ChapterID=@ChapterID
		END 
	ELSE
		BEGIN 
			Select Distinct Ltrim(Rtrim(ClassName)) + ' - ' + Section AS ClassName from [dbo].[AMC_ClassType] WITH (NOLOCK)
			Where ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
			 
		END 
END