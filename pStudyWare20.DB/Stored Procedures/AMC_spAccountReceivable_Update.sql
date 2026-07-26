CREATE proc [dbo].[AMC_spAccountReceivable_Update] 
 @ArID int=0
,@Name  varchar(100) 
,@Email  varchar(200) 
,@PaymentMode  varchar(20) 
,@PaymentDate  datetime 
,@Amount  money
,@PayerType  varchar(20) 
,@Documents  varchar(100) 
,@Comments  varchar(1000) 
,@userName varchar(50) 
AS
BEGIN

	IF @ArID>0 
		BEGIN
			Update [AMC_tblAccountPayable]
				SET [PayableTo]=@Name
					,[Description]=@Email
					,[PaymentMode]=@PaymentMode
					,[PaymentDate]=@PaymentDate
					,[Amount]=@Amount
					,[ExpenseType]= @PayerType
					,[Documents]=@Documents
					,[Comments]=@Comments
					,[ChangeBy]=@userName
					,[ChangeDate]=getdate()
			Where ApID=@ArID
		END 
	ELSE 
		BEGIN
	  		INSERT INTO [dbo].[AMC_tblAccountReceivable]
				   ([Name]
				   ,[Email]
				   ,[PaymentMode]
				   ,[PaymentDate]
				   ,[Amount]
				   ,[PayerType]
				   ,[Documents]
				   ,[Comments]
				   ,[CreatedBy]
				   ,[CreatedDate]
				   ,[ChangeBy]
				   ,[ChangeDate])
			 VALUES
				   ( @Name 
					,@Email
					,@PaymentMode 
					,@PaymentDate 
					,@Amount 
					,@PayerType
					,@Documents   
					,@Comments 
					,@userName
					,getdate()
					,@userName
					,getdate()
				   )
		END 
	END