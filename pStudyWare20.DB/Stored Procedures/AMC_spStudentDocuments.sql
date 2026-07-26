CREATE  proc [dbo].[AMC_spStudentDocuments] 
@Username varchar(100)= null
AS
BEGIN

	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @ChapterID int
	Declare @ClassAccess char(1)
	Declare @DocID int
	----------Settings-----------------------------
	
	Select @sUserType=MemberType
	,@iUserID=pMemberID
	,@ChapterID=ChapterID
	,@ClassAccess=ClassAccess from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	Select  @DocID=DisplayDocumentsFrom from AMC_tblLookupSemester with (NOLOCK)

 	 IF @sUserType='S'  
			BEGIN 
					SELECT 
						 Row_Number() OVER(order by mdocId) as mDocID 
						,mDocID as [DocumentID]
						,[mDocName]
						,[Description]
						,[Type]
						,[mDocName]
						,[InsertDate]
						FROM [dbo].[AMC_tblStudentDocuments]
					where [mStudentID]  in (select 
						 TS.[colStudentID] 
					   FROM [AMC_tblUsers] TU WITH (NOLOCK)
					  Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					  on TU.coluserID=TS.colParentID
					  where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
					  )
					  Order by [InsertDate] desc
			END 
		IF @sUserType='I' and  @ClassAccess='A'
			BEGIN 
					SELECT 
						 Row_Number() OVER(order by mdocId) as mDocID 
						,mDocID as [DocumentID]
						,[mDocName]
						,[Description]
						,[Type]
						,[mDocName]
						,[InsertDate]
						FROM [dbo].[AMC_tblStudentDocuments]
					where [mStudentID]  in
					 (
							Select StudentID from AMC_tblStudents TS WITH (NOLOCK)
							inner join AMC_ClassMaster CM  WITH (NOLOCK)
							on CM.StudentID=TS.colStudentID
							Inner join AMC_InstructorMaster IM  WITH (NOLOCK)
							on IM.Class=CM.Class
							and IM.ChapterID=TS.ChapterID
							where IM.InstructorID=@iUserID
							and IM.ChapterID=@ChapterID
					 )
					 and mDOcID>@DocID
					  Order by  [InsertDate] desc	
			END 

		ELSE IF @sUserType='I' and  @ClassAccess='N'  
			BEGIN 
					SELECT 
						 Row_Number() OVER(order by mdocId) as mDocID 
						,mDocID as [DocumentID]
						,[mDocName]
						,[Description]
						,[Type]
						,[mDocName]
						,[InsertDate]
						FROM [dbo].[AMC_tblStudentDocuments]
					where [mStudentID]  in
					 (
						Select StudentID from [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
					    inner join AMC_InstructorMaster IM  WITH (NOLOCK)
						on CM.Class=IM.Class
						and CM.Section=IM.Section
						where IM.InstructorID=@iUserID
						and IM.ChapterID=@ChapterID
					 )
					  and mDOcID>@DocID
					  Order by  [InsertDate] desc			 
		  END 

		  ELSE 
			BEGIN 
					SELECT 
						 Row_Number() OVER(order by mdocId) as mDocID 
						,mDocID as [DocumentID]
						,[mDocName]
						,[Description]
						,[Type]
						,[mDocName]
						,[InsertDate]
						FROM [dbo].[AMC_tblStudentDocuments]
					where [mStudentID]  in (select 
						 TS.[colStudentID] 
					   FROM [AMC_tblUsers] TU WITH (NOLOCK)
					  Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					  on TU.coluserID=TS.colParentID
					  Where TS.ChapterID in 
					  (Select ChapterID from dbo.GettingAuthorizedChapter(@Username)))
					   and mDOcID>@DocID
					  Order by [Description] desc		 
		  END 
END