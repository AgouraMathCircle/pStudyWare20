CREATE proc [dbo].[AMC_spAccountReceivable_Select] 
 @ArID int=0
AS
BEGIN

IF @ArID=0
	BEGIN
		SELECT [ArID]
			  ,[Name]
			  ,[Email]
			  ,[PaymentMode]
			  ,[PaymentDate]
			  ,[Amount]
			  ,[PayerType]
			  ,[Documents]
			  ,[Comments]
		  FROM [dbo].[AMC_tblAccountReceivable] WITH (NOLOCK)
		  Order by [PaymentDate] Desc
	  END 
ELSE
	 BEGIN
		SELECT [ArID]
			  ,[Name]
			  ,[Email]
			  ,[PaymentMode]
			  ,[PaymentDate]
			  ,[Amount]
			  ,[PayerType]
			  ,[Documents]
			  ,[Comments]
		  FROM [dbo].[AMC_tblAccountReceivable] WITH (NOLOCK)
		  Where [ArID]=@ArID
	  END 

END