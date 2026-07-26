CREATE proc [dbo].[AMC_spAccountPayable_Update] 
 @ApID int
,@PayableTo  varchar(100) 
,@Description  varchar(200) 
,@PaymentMode  varchar(20) 
,@PaymentDate  datetime 
,@Amount  money
,@ExpenseType  varchar(20) 
,@Documents  varchar(100) 
,@Comments  varchar(1000) 
,@userName varchar(50) 
AS
BEGIN

	IF @ApID>0 
		BEGIN
			Update  [dbo].[AMC_tblAccountPayable]
				SET [PayableTo]=@PayableTo
					,[Description]=@Description
					,[PaymentMode]=@PaymentMode
					,[PaymentDate]=@PaymentDate
					,[Amount]=@Amount
					,[ExpenseType]= @ExpenseType
					,[Documents]=@Documents
					,[Comments]=@Comments
					,[ChangeBy]=@userName
					,[ChangeDate]=getdate()
			Where ApID=@ApID
		END 
	ELSE 
		BEGIN
	  		INSERT INTO [dbo].[AMC_tblAccountPayable]
				   ([PayableTo]
				   ,[Description]
				   ,[PaymentMode]
				   ,[PaymentDate]
				   ,[Amount]
				   ,[ExpenseType]
				   ,[Documents]
				   ,[Comments]
				   ,[CreatedBy]
				   ,[CreatedDate]
				   ,[ChangeBy]
				   ,[ChangeDate])
			 VALUES
				   ( @PayableTo 
					,@Description 
					,@PaymentMode 
					,@PaymentDate 
					,@Amount 
					,@ExpenseType 
					,@Documents   
					,@Comments 
					,@userName
					,getdate()
					,@userName
					,getdate()
				   )
		END 
	END