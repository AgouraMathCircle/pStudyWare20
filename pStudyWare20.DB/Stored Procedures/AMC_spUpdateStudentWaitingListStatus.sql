CREATE proc [dbo].[AMC_spUpdateStudentWaitingListStatus] 
(
@StudentID int =0,
@Class char(2),
@Section char(1),
@ChapterID char(2),
@Location char(1),
@Session char(5)
)
AS
BEGIN
	
	
	IF @StudentID >0
		BEGIN
			Declare @UserName varchar(100)
			Declare @RequestedLocation  char(1)  
 			Declare @DefaultChapter int 
			Declare @colParentID int

			Select @UserName=TU.coluserEmail,@RequestedLocation=TS.ColEventLocation,@colParentID=TU.[coluserID] from AMC_tblUsers TU WITH (NOLOCK)
			inner Join [dbo].[AMC_tblStudents] TS WITH (NOLOCK)
			on TU.[coluserID]=TS.colParentID
			where TS.colStudentID=@StudentID

			Select @DefaultChapter=min(ChapterID) from  [dbo].[AMC_tblStudents]  WITH (NOLOCK) where colParentID=@colParentID

			update [AMC_tblStudents] Set colStatus='R',ColEventLocation=@Location,colStudentEnrolledSession=@Session
			Where [colStudentID]=@StudentID

		    Update  AMC_ClassMaster Set Class=@Class,Section=@Section
			Where StudentID=@StudentID

			Update MemberMaster Set Approved=1,Active=1,ChapterID=@ChapterID,DefaultChapter=@DefaultChapter
			Where upper(ltrim(Username))=upper(ltrim(@Username))

			IF @Location='O'
				BEGIN
					Update [AMC_tblStudents] Set WaitingListStatus='N' 
					 Where [colStudentID]=@StudentID
				END 
			ELSE IF @RequestedLocation<>@Location 
				BEGIN
					 Update [AMC_tblStudents] Set WaitingListStatus='Y' 
					 Where [colStudentID]=@StudentID
				END 

	 	END
    
END