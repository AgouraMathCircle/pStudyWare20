CREATE  proc [dbo].[AMC_spGetAllDonors] 
@RowID int=0
AS
BEGIN

 
 IF ( @RowID = 0)
 BEGIN
	Select [DonorID],[DonorName],[DonorLevel],[Year],[Semester] from [dbo].[AMC_tblDonors]  with (NOLOCK) order by [Year] Desc 				 
 
 END
 ELSE
  BEGIN
	Select [DonorID],[DonorName],[DonorLevel],[Year],[Semester] from [dbo].[AMC_tblDonors]  with (NOLOCK) where Donorid=@RowID order by [Year] Desc 				 
 
 END


END