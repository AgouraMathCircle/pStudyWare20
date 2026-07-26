CREATE PROC [dbo].[Apps_GetAlertList]
@RowID int=0
AS
BEGIN
	 If @RowID = 0
	 BEGIN
		  SELECT Row_Number() OVER(order by MessageID) as RowID,Convert( Varchar(10), [PostedDate], 101 )  [AlertDate]
			  ,[Message] As [Description]
			  ,PostedDate as [PostedDate]
			  ,CAST(Day(PostedDate) as varchar(3)) AS [PostedDay]
			  ,CAST(PostedDate AS CHAR(3)) AS  [PostedMonth]
			  ,CAST(Year(PostedDate) as varchar(4))  AS  [PostedYear] 
			  ,Active,MessageID
		  FROM [dbo].[AMC_tblPostMessage] WITH (NOLOCK) where Active=1
	 END
	 Else 
	  BEGIN
		  SELECT Row_Number() OVER(order by MessageID) as RowID,Convert( Varchar(10), [PostedDate], 101 )  [AlertDate]
			  ,[Message] As [Description]
			  ,PostedDate as [PostedDate]
			  ,CAST(Day(PostedDate) as varchar(3)) AS [PostedDay]
			  ,CAST(PostedDate AS CHAR(3)) AS  [PostedMonth]
			  ,CAST(Year(PostedDate) as varchar(4))  AS  [PostedYear] 
			  ,Active,MessageID
		  FROM [dbo].[AMC_tblPostMessage] WITH (NOLOCK) where Active=1 and MessageID =@RowID 
	 END

END

--exec [dbo].[Apps_GetAlertList] '21'
-- delete AMC_tblPostMessage where MessageID =1