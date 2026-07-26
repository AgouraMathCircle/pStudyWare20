CREATE  proc [dbo].[AMC_spSelectUserTrackingSummary] 
AS
BEGIN
Create table #Results(VisitedDate Date,WebCount int,AppCount int,UpdateScoreCnt int) 

Insert into #Results (VisitedDate,WebCount,AppCount,UpdateScoreCnt)
Select top 10  CONVERT(varchar,LoginDate, 23),0,0,0  From [dbo].[AMC_tblUserTracking] with (NOLOCK)  
Group by CONVERT(varchar,LoginDate, 23) 
Order by CONVERT(varchar,LoginDate, 23) desc

Update #Results Set WebCount=OJ.TotalUsers from #Results A with (NOLOCK)
Inner Join (
Select  CONVERT(varchar,LoginDate, 23) VisitedDate, Count(*) TotalUsers
From [AMC_tblUserTracking] A With(NOLOCK)
Inner Join #Results B 
On B.VisitedDate=CONVERT(varchar,A.LoginDate, 23)
Where A.UserType not in ('APPUSER')
Group by CONVERT(varchar,LoginDate, 23)
) OJ
on OJ.VisitedDate=A.VisitedDate
 
Update #Results Set AppCount=OJ.TotalUsers from #Results A with (NOLOCK)
Inner Join (
Select  CONVERT(varchar,LoginDate, 23) VisitedDate, Count(*) TotalUsers
From [AMC_tblUserTracking] A With(NOLOCK)
Inner Join #Results B 
On B.VisitedDate=CONVERT(varchar,A.LoginDate, 23)
Where A.UserType in ('APPUSER')
Group by CONVERT(varchar,LoginDate, 23)
) OJ
on OJ.VisitedDate=A.VisitedDate
 
Update #Results Set UpdateScoreCnt=B.TotalCnt from #Results A 
Inner join (
Select Count(Distinct mStudentID) TotalCnt from [dbo].[AMC_tblReportCard] with (NOLOCK) 
where mExamDate in(Select CurrentExamDate From [AMC_tblLookupSemester] with (NOLOCK))
)B
on A.UpdateScoreCnt=0

Select CONVERT(varchar,VisitedDate, 23) AS VisitedDate,WebCount,AppCount,UpdateScoreCnt from  #Results With (NOLOCK) Order by VisitedDate desc

Drop table #Results

END