CREATE proc [dbo].[AMC_spSelectReportCardDate] 
@Username varchar(100)= null
AS
BEGIN
	

	Declare @ReportDate Date
	Declare @CurrentSemster Char(5)
	
	Select @ReportDate=DateAdd(d,-45,StartingDate),@CurrentSemster=semester from AMC_tblLookupSemester with (NOLOCK) 
	Where Active=1
 

	Select Distinct Convert( Varchar(10), mExamDate, 101 ) ReportDate,mExamDate 
	from [dbo].[AMC_tblReportCard] WITH (NOLOCK)
	where  mExamDate>@ReportDate 
	and ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
	order by mExamDate desc
END