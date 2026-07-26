CREATE proc [dbo].[AMC_spReportCard_SummaryReport] 
@Username varchar(100) 
,@ReportDate Date
,@Class varchar(100)= 'ALL'
AS
BEGIN

	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Select @sUserType=MemberType,@iUserID=pMemberID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))
	
	Create table #tempReportSummary
	(
	StudentID int,
	Email varchar(300),
	Class varchar(30),
	ExamDate Date,
	QuizT int default 0,
	QuizR float default 0,
	QuizC varchar(1000),
	ClassT int default 0,
	ClassR float default 0,
	ClassC varchar(1000),
	HomeWorkT int default 0,
	HomeWorkR float default 0,
	HomeWorkC varchar(1000),
	FinalExamT int default 0,
	FinalExamR float default 0,
	FinalExamC varchar(1000),
	PlacementTestT int default 0,
	PlacementTestR float default 0,
	PlacementTestC varchar(1000),
	TotalScore float default 0,
	ClassRank int
    )

	IF @sUserType='I'  
		BEGIN 
				Insert into #tempReportSummary(StudentID,Class,ExamDate)
				Select Distinct mStudentID,mGroup,mExamDate  from [dbo].[AMC_tblReportCard] with (NOLOCK)
				where  [mStudentID] in 
										( 
										Select StudentID from [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
										inner join AMC_InstructorMaster IM  WITH (NOLOCK)
										on CM.Class=IM.Class
										where IM.InstructorID=@iUserID
										)
				and CONVERT(date, mExamDate, 101 )=CONVERT(date, @ReportDate, 101 )
		 END 
	ELSE
		BEGIN 
				Insert into #tempReportSummary(StudentID,Class,ExamDate)
				Select Distinct mStudentID,mGroup,mExamDate  from [dbo].[AMC_tblReportCard] with (NOLOCK)
				where  Ltrim(rtrim(mGroup))=Ltrim(rtrim(@Class))
				and CONVERT(date, mExamDate, 101 )=CONVERT(date, @ReportDate, 101 )
				and ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
		 END 
	
	Update #tempReportSummary Set Email=C.coluserEmail
	From #tempReportSummary A with (NOLOCK)
	inner join AMC_tblStudents B with (NOLOCK)
	on A.StudentID=B.colStudentID
	inner join AMC_tblUsers C with (NOLOCK)
	on C.coluserID=B.colParentID
		 
	Update #tempReportSummary 
	Set QuizT=B.mTotalPoints,
		QuizR=B.mReceivedPoints,
		QuizC=B.mComments
	From #tempReportSummary A WITH (NOLOCK)
	inner join AMC_tblReportCard B WITH (NOLOCK)
	on A.StudentID=B.mStudentID
	and A.ExamDate=B.mExamDate
	where B.mType='Quiz'

	Update #tempReportSummary 
	Set ClassT=B.mTotalPoints,
		ClassR=B.mReceivedPoints,
		ClassC=B.mComments
	From #tempReportSummary A WITH (NOLOCK)
	inner join AMC_tblReportCard B WITH (NOLOCK)
	on A.StudentID=B.mStudentID
	and A.ExamDate=B.mExamDate
	where B.mType='Class Test'

	Update #tempReportSummary 
		Set HomeWorkT=B.mTotalPoints,
		HomeWorkR=B.mReceivedPoints,
		HomeWorkC=B.mComments
	From #tempReportSummary A WITH (NOLOCK)
	inner join AMC_tblReportCard B WITH (NOLOCK)
	on A.StudentID=B.mStudentID
	and A.ExamDate=B.mExamDate
	where B.mType='Home Work'
	
	Update #tempReportSummary 
		Set FinalExamT=B.mTotalPoints,
		FinalExamR=B.mReceivedPoints,
		FinalExamC=B.mComments
	From #tempReportSummary A WITH (NOLOCK)
	inner join AMC_tblReportCard B WITH (NOLOCK)
	on A.StudentID=B.mStudentID
	and A.ExamDate=B.mExamDate
	where B.mType='Final Exam'

	Update #tempReportSummary 
		Set PlacementTestT=B.mTotalPoints,
		PlacementTestR=B.mReceivedPoints,	
		PlacementTestC=B.mComments
	From #tempReportSummary A WITH (NOLOCK)
	inner join AMC_tblReportCard B WITH (NOLOCK)
	on A.StudentID=B.mStudentID
	and A.ExamDate=B.mExamDate
	where B.mType='Placement Test'

	Update #tempReportSummary 
		Set TotalScore=QuizR+ClassR+HomeWorkR+FinalExamR+PlacementTestR
	From #tempReportSummary

	Create table #TempRank(sRank int identity (1,1) ,TotalScore float)
	Insert into #TempRank
	Select Distinct TotalScore from #tempReportSummary (NOLOCK)
	order by TotalScore desc



	Update #tempReportSummary Set ClassRank=B.sRank
	From #tempReportSummary A (NOLOCK)
	inner join #TempRank B (NOLOCK)
	on A.TotalScore=B.TotalScore

	SELECT TS.[colStudentID]  As StudentID
			,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
			,RC.Email [ParentEmail]
			,RC.[Class] [Group]
			,RC.[ExamDate] [ExamDate]
			,RC.[QuizT]	 [QuizTotal]	 
			,RC.[QuizR]	 [QuizReceived]	 
			,RC.[QuizC]	 [QuizComments]	
			,RC.[ClassT] [ClassTotal]		 
			,RC.[ClassR] [ClassReceived]		 
			,RC.[ClassC] [ClassComments]
			,RC.[HomeWorkT] [HomeWorkTotal]	 
			,RC.[HomeWorkR] [HomeWorkReceived]
			,RC.[HomeWorkC] [HomeWorkComments]
			,RC.[FinalExamT] [FinalExamTotal]	 
			,RC.[FinalExamR] [FinalExamReceived]
			,RC.[FinalExamC] [FinalExamComments]
			,RC.[PlacementTestT] [PlacementTestTotal]	 
			,RC.[PlacementTestR] [PlacementTestReceived]
			,RC.[PlacementTestC] [PlacementTestComments]
			,RC.[TotalScore] [TotalScore] 
			,RC.[ClassRank] [ClassRank] 
			FROM [AMC_tblUsers] TU WITH (NOLOCK)
			Inner Join AMC_tblStudents TS  WITH (NOLOCK)
			on TU.coluserID=TS.colParentID
			inner join #tempReportSummary RC WITH (NOLOCK)
			ON TS.colStudentID=RC.StudentID
			Order by TS.[colStudentFName]

	Drop table #tempReportSummary
	Drop table #TempRank

END