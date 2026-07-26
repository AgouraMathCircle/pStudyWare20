CREATE proc [dbo].[AMC_spAccountPayable_Select] 
 @ApID int=0
AS
BEGIN

IF @ApID=0
	BEGIN
		SELECT [ApID]
			  ,[PayableTo]
			  ,[Description]
			  ,[PaymentMode]
			  ,[PaymentDate]
			  ,[Amount]
			  ,[ExpenseType]
			  ,[Documents]
			  ,[Comments]
		  FROM [dbo].[AMC_tblAccountPayable] WITH (NOLOCK)
		  Order by [PaymentDate] Desc
	  END 
ELSE
	 BEGIN
		SELECT [ApID]
			  ,[PayableTo]
			  ,[Description]
			  ,[PaymentMode]
			  ,[PaymentDate]
			  ,[Amount]
			  ,[ExpenseType]
			  ,[Documents]
			  ,[Comments]
		  FROM [dbo].[AMC_tblAccountPayable] WITH (NOLOCK)
		  Where [ApID]=@ApID
	  END 

END