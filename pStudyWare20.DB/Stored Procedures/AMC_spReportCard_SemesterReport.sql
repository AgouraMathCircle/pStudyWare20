CREATE proc [dbo].[AMC_spReportCard_SemesterReport] 
@Username varchar(100) 
,@Class varchar(100)= 'ALL'
AS
BEGIN

	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Select @sUserType=MemberType,@iUserID=pMemberID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))
	
	Declare @ReportDate Date
	Declare @CurrentSemster Char(5)
	Select @ReportDate=DateAdd(d,-1,StartingDate),@CurrentSemster=semester 
	from AMC_tblLookupSemester with (NOLOCK) 
	Where Active=1
	
	Create table #tempReportSummary
	(
	StudentID int,
	Email varchar(300),
	Class varchar(30),
	ExamDate char(5),
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
				Select Distinct mStudentID,mGroup,@CurrentSemster from [dbo].[AMC_tblReportCard] with (NOLOCK)
				where  [mStudentID] in 
										( 
										Select StudentID from [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
										inner join AMC_InstructorMaster IM  WITH (NOLOCK)
										on CM.Class=IM.Class
										and CM.Section=IM.Section
										where IM.InstructorID=@iUserID
										)
				and mExamDate>@ReportDate 
		 END 
	ELSE
		BEGIN 
				Insert into #tempReportSummary(StudentID,Class,ExamDate)
				Select Distinct mStudentID,mGroup,@CurrentSemster from [dbo].[AMC_tblReportCard] with (NOLOCK)
				where  Ltrim(rtrim(mGroup))=Ltrim(rtrim(@Class))
				and mExamDate>@ReportDate 
				 
		 END 
	
	Update #tempReportSummary Set Email=C.coluserEmail
	From #tempReportSummary A with (NOLOCK)
	inner join AMC_tblStudents B with (NOLOCK)
	on A.StudentID=B.colStudentID
	inner join AMC_tblUsers C with (NOLOCK)
	on C.coluserID=B.colParentID
		 
   Update #tempReportSummary 
	Set QuizT=oB.TotalPoints,
		QuizR=oB.ReceivedPoints 
	From #tempReportSummary oA WITH (NOLOCK)
	inner join(
	Select iA.mStudentID  StudentID,
	Sum(iA.mTotalPoints)  TotalPoints,
	Sum(iA.mReceivedPoints) ReceivedPoints 
	From AMC_tblReportCard iA WITH (NOLOCK)
	inner Join #tempReportSummary iB
	on iA.mStudentID=iB.StudentID
	where iA.mType='Quiz'
	and iA.mExamDate>@ReportDate
	Group by iA.mStudentID
	 ) oB
   on oA.StudentID=oB.StudentID

	 Update #tempReportSummary 
	Set ClassT=oB.TotalPoints,
		ClassR=oB.ReceivedPoints 
	From #tempReportSummary oA WITH (NOLOCK)
	inner join(
	Select iA.mStudentID  StudentID,
	Sum(iA.mTotalPoints)  TotalPoints,
	Sum(iA.mReceivedPoints) ReceivedPoints 
	From AMC_tblReportCard iA WITH (NOLOCK)
	inner Join #tempReportSummary iB
	on iA.mStudentID=iB.StudentID
	where iA.mType='Class Test'
	and iA.mExamDate>@ReportDate
	Group by iA.mStudentID
	 ) oB
   on oA.StudentID=oB.StudentID


    Update #tempReportSummary 
	Set HomeWorkT=oB.TotalPoints,
		HomeWorkR=oB.ReceivedPoints 
	From #tempReportSummary oA WITH (NOLOCK)
	inner join(
	Select iA.mStudentID  StudentID,
	Sum(iA.mTotalPoints)  TotalPoints,
	Sum(iA.mReceivedPoints) ReceivedPoints 
	From AMC_tblReportCard iA WITH (NOLOCK)
	inner Join #tempReportSummary iB
	on iA.mStudentID=iB.StudentID
	where iA.mType='Home Work'
	and iA.mExamDate>@ReportDate
	Group by iA.mStudentID
	 ) oB
   on oA.StudentID=oB.StudentID

	 
	 Update #tempReportSummary 
	Set FinalExamT=oB.TotalPoints,
		FinalExamR=oB.ReceivedPoints 
	From #tempReportSummary oA WITH (NOLOCK)
	inner join(
	Select iA.mStudentID  StudentID,
	Sum(iA.mTotalPoints)  TotalPoints,
	Sum(iA.mReceivedPoints) ReceivedPoints 
	From AMC_tblReportCard iA WITH (NOLOCK)
	inner Join #tempReportSummary iB
	on iA.mStudentID=iB.StudentID
	where iA.mType='Final Exam'
	and iA.mExamDate>@ReportDate
	Group by iA.mStudentID
	 ) oB
   on oA.StudentID=oB.StudentID

	--  Update #tempReportSummary 
	--Set PlacementTestT=oB.TotalPoints,
	--	PlacementTestR=oB.ReceivedPoints 
	--From #tempReportSummary oA WITH (NOLOCK)
	--inner join(
	--Select iA.mStudentID  StudentID,
	--Sum(iA.mTotalPoints)  TotalPoints,
	--Sum(iA.mReceivedPoints) ReceivedPoints 
	--From AMC_tblReportCard iA WITH (NOLOCK)
	--inner Join #tempReportSummary iB
	--on iA.mStudentID=iB.StudentID
	--where iA.mType='Placement Test'
	--and iA.mExamDate>@ReportDate
	--Group by iA.mStudentID
	-- ) oB
 --  on oA.StudentID=oB.StudentID


	
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