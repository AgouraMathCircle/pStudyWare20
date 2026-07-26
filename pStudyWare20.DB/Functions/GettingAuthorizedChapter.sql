CREATE  FUNCTION [dbo].[GettingAuthorizedChapter]
(
@UserName varchar(100)
)
RETURNS @AuthorizedChapters TABLE 
(ChapterID int)
AS
BEGIN 
	
	Declare @UserID int
	Declare @MemberType char(1) 
	Declare @ChapterList varchar(20)
	
	SELECT @ChapterList=ChapterID,@MemberType=MemberType,@UserID=pMemberID FROM MemberMaster WITH (NOLOCK) 
	WHERE upper(ltrim(UserName))=upper(ltrim(@UserName))
	
	IF @MemberType='A'
			BEGIN
				Insert into @AuthorizedChapters (ChapterID)
				SELECT ChapterID  FROM  [dbo].[AMC_AuthorizedChapter] with (NOLOCK)
				Where UserID=@UserID ORDER BY ChapterID
			END 
	ELSE
			BEGIN 
				  Insert into @AuthorizedChapters SELECT @ChapterList
			END 
  RETURN  
END