CREATE PROC [dbo].[Apps_GetStudentReportDetailsById](@StudentId int)
AS
BEGIN
	 	
	Declare @ReportDate Date
	Declare @CurrentSemster Char(5)
	Select @ReportDate=DateAdd(d,-1,StartingDate),@CurrentSemster=semester from AMC_tblLookupSemester with (NOLOCK) 
	Where Active=1

	---------------Calculate the Top Score and Avg Score------------------
	Create table #ClassSummary(mGroup varchar(50),mExamDate dateTime,mType varchar(30),TopScore int,ClassAvgScore float)

	Insert into #ClassSummary (mGroup,mExamDate,mType,TopScore)
	Select mGroup,mExamDate,mType,Max(mReceivedPoints) from [AMC_tblReportCard] 
	group by mGroup,mExamDate,mType
	order by mGroup,mExamDate,mType

	Update #ClassSummary set ClassAvgScore=RS.ClassAvgScore from #ClassSummary CS WITH (NOLOCK)
    inner join (
	Select mGroup,mExamDate,mType,Round(avg(mReceivedPoints),2) ClassAvgScore from [AMC_tblReportCard] 
	group by mGroup,mExamDate,mType
 	) RS
	on RS.mExamDate=CS.mExamDate
	and RS.mGroup=CS.mGroup
	and RS.mType=CS.mType
	---------------Display the Results -------------------------------------------------
	SELECT			
		RC.[mGroup] [Class]
		,RC.[mSemster] As [Session]
		,RC.[mType] [ExamType]
		,Convert( Varchar(10), RC.[mExamDate], 101 )  [ExamDate]
		,CAST(RC.[mTotalPoints] as int) [TotalScore]
		,CAST(RC.[mReceivedPoints] as int) [Score]
		,CAST(CS.TopScore as int) [TopScore]
		--,CS.ClassAvgScore ClassAverage 
		,Day(RC.mExamDate) AS [ExamDay]
 		,CAST(RC.mExamDate AS CHAR(3)) AS  [ExamMonth]
		,Year(RC.mExamDate) AS  [ExamYear]
		FROM AMC_tblStudents TS  WITH (NOLOCK)
		inner join [dbo].[AMC_tblReportCard] RC WITH (NOLOCK)
		ON TS.colStudentID=RC.mStudentID
		inner join #ClassSummary CS
		on CS.mGroup=RC.[mGroup]
		and CS.mExamDate=RC.mExamDate
		and CS.mType=RC.mType
		where TS.colStudentID=@StudentId and RC.mExamDate>@ReportDate
		Order by RC.mReportCardID desc
	---------------Display the Results -------------------------------------------------
	 Drop table #ClassSummary
END