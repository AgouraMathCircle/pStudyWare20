CREATE proc [dbo].[AMC_spSelectEmailGroupbyUserName] 
@Username varchar(100)
AS
BEGIN
	Declare @Currentsemester varchar(5)
	Select @Currentsemester= semester from [dbo].[AMC_tblLookupSemester] 
	WITH (NOLOCK) Where Active=1

	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @ChapterID int
	Select @sUserType=MemberType,@iUserID=pMemberID,@ChapterID=ChapterID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	IF @sUserType='I'  
					BEGIN 
					   Select Ltrim(Rtrim(CT.ClassName)) + ' - ' + CT.Section AS Class
					   , CT.StudentEmailGroup InstructorEmailGroup
					   , CT.InstructorEmailGroup InstructorEmailGroup  from [dbo].[AMC_ClassType] CT WITH (NOLOCK)
						inner join [dbo].[AMC_InstructorMaster] IM  WITH (NOLOCK)
						on CT.Class=IM.Class
						and CT.Section=IM.Section
						where IM.InstructorID=@iUserID
						and IM.ChapterID=@ChapterID
					END 
	IF @sUserType='S' 
		BEGIN  
			Select AC.[Name] + '-' + (CT.ClassName) + ' - ' + CT.Section as Class, 
					CT.InstructorEmailGroup InstructorEmailGroup 
			FROM [AMC_tblUsers] TU WITH (NOLOCK)
					Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					on TU.coluserID=TS.colParentID
					inner join [dbo].[AMC_ChapterMaster] AC WITH (NOLOCK)
  					on TS.ChapterID=AC.ChapterID
					inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
					on TS.colStudentID=CM.StudentID
					inner Join  [dbo].[AMC_ClassType] CT with (NOLOCK) 
					on CT.Class=CM.Class
					and CT.section=CM.Section
					and CT.ChapterID=TS.ChapterID
			  where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
			  and (TS.[colStudentEnrolledSession]  =@Currentsemester)
		  END 
	ELSE 
			  BEGIN 
				Select AC.[Name] + '-' + (CT.ClassName) + ' - ' + CT.Section as Class, 
				CT.StudentEmailGroup InstructorEmailGroup 
				from [dbo].[AMC_ClassType] CT WITH (NOLOCK)
				inner Join [AMC_ChapterMaster] AC WITH (NOLOCK)
				on AC.ChapterID=CT.ChapterID
				Where AC.ChapterID=@ChapterID
				Order by DisplayOrder 
		    END 
END