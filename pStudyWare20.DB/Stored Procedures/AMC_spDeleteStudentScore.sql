CREATE proc [dbo].[AMC_spDeleteStudentScore] 
(
	@ReportCardID int =0 
)
AS
BEGIN
 
	IF @ReportCardID >0
		BEGIN
			Delete from [dbo].[AMC_tblReportCard] where [mReportCardID]=@ReportCardID
		END	
	 
    
END