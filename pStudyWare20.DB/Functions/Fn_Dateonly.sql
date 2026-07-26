Create FUNCTION [dbo].[Fn_Dateonly] 
(
@DateTime DateTime
)
RETURNS dateTime
AS
BEGIN
 return dateadd(dd,0,datediff(dd,0,@DateTime))
END