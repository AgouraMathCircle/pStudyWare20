CREATE proc [dbo].[AMC_spPostMessage_Insert] 
 @MessageID int
,@Message nvarchar(max)
,@PostedBy varchar(50)
,@PostedDate datetime          
,@Active bit

AS
BEGIN
	 DECLARE  @Type char(3)
	 set @Type='1'
	IF(@MessageID = 0)
			BEGIN 
		
		INSERT INTO [dbo].[AMC_tblPostMessage]
				   ([Message]
				   ,[PostedBy]
				   ,[PostedDate]           
				   ,[Active]
				   ,[Type]
				   )
			 VALUES
				   ( @Message 
				   ,@PostedBy 
				   ,@PostedDate 
				   ,@Active
				   ,@Type 
				   )
				END
	ELSE
			BEGIN

				UPDATE [dbo].[AMC_tblPostMessage]
					   SET  
						  [Message] = @Message 
						  ,[PostedBy] = @PostedBy 
						  ,[PostedDate] = @PostedDate 
						  ,[Active] = @Active 
						 WHERE [MessageID] = @MessageID

				END


END