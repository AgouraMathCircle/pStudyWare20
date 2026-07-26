CREATE PROCEDURE [dbo].[pWebComments]
	@mode varchar(50)='',
	@name varchar(100) = '',
	@emailId varchar(100) = '',
	@comment nvarchar(max) = '',
	@pCommentId int = 0
AS
BEGIN
	SET NOCOUNT ON;

	IF(@mode = 'GetComments')
	BEGIN
		SELECT  *
		FROM	Comments (NOLOCK)
		WHERE	DeleteDate is null	
		Order by PostedDate desc
	END 
	IF(@mode = 'AddComments')
	BEGIN
		INSERT  INTO Comments
				(Name
				,EmailID
				,Comments
				,PostedDate)
		VALUES	(@name
				,@emailId 
				,@comment
				,GETDATE())
	END 
	IF(@mode = 'DeleteComments')
	BEGIN
		UPDATE	Comments
		SET		DeleteDate = GETDATE()
				,DeleteBy = @name
		WHERE	pCommentId = @pCommentId
	END 
END