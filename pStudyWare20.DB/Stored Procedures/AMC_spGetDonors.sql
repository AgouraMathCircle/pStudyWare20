CREATE  proc [dbo].[AMC_spGetDonors] 
AS
BEGIN

Select  [Year],ROW_NUMBER() OVER(ORDER BY [Year] desc) as RowID  from [dbo].[AMC_tblDonors] 
as  #YEAR with (NOLOCK) 
group by [Year]	order by [Year] Desc				 

Select [DonorName],[DonorLevel],[Year] from [dbo].[AMC_tblDonors]   with (NOLOCK) where [DonorLevel]='DIAMOND' order by [Year] Desc 				 
Select [DonorName],[DonorLevel],[Year] from [dbo].[AMC_tblDonors]  with (NOLOCK) where [DonorLevel]='PLATINUM' order by [Year] Desc				 
Select [DonorName],[DonorLevel],[Year] from [dbo].[AMC_tblDonors]  with (NOLOCK) where [DonorLevel]='GOLD' order by [Year] Desc				 
Select [DonorName],[DonorLevel],[Year] from [dbo].[AMC_tblDonors]  with (NOLOCK) where [DonorLevel]='SILVER' order by [Year] Desc				 
Select [DonorName],[DonorLevel],[Year] from [dbo].[AMC_tblDonors]  with (NOLOCK) where [DonorLevel]='BRONZE' order by [Year] Desc				 
			 



END 
 


 --exec [dbo].[AMC_spGetDonors]