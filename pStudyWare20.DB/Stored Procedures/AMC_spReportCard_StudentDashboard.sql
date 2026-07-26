CREATE proc [dbo].[AMC_spReportCard_StudentDashboard] 
@Username varchar(100)  
AS
BEGIN

	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Select @sUserType=MemberType,@iUserID=pMemberID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))


	Declare @ReportDate Date
	Select @ReportDate=DateAdd(day,-30,Max(mExamDate)) from [AMC_tblReportCard]  with (NOLOCK) 
   
	---------------Calculate the Top Score and Avg Score------------------
 
	Create table #ClassSummary(mGroup varchar(50),mSection Char(1), mExamDate dateTime,mType varchar(30),TopScore int,ClassAvgScore float)

	Insert into #ClassSummary (mGroup,mExamDate,mType,mSection,ClassAvgScore,TopScore)
	Select mGroup,mExamDate,mType,CM.Section, Round(avg(mReceivedPoints),0) ClassAvgScore,max(mReceivedPoints) 
	from [AMC_tblReportCard] RC With (NOLOCK) 
	inner join  [dbo].[AMC_ClassMaster] CM  With (NOLOCK) 
	on CM.Class=RC.mClass
	and CM.Section=RC.mSection
	Where mExamDate>@ReportDate  
	group by mGroup,mExamDate,mType, CM.Section
	
	BEGIN 
				 	SELECT TS.[colStudentID]  As StudentID
				 	,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
				 	,RC.[mSemster] As Semester
					,RC.[mType] [ExamType]
					,Convert( Varchar(10), RC.[mExamDate], 101 )  [ExamDate]
					,RC.[mTotalPoints] [TotalCredit]
					,CS.TopScore HighestScore
					,CS.ClassAvgScore ClassAverage 
					,RC.[mReceivedPoints] [ReceivedCredit]
					,RC.[mGroup] [Group]
					,RC.[mComments] [Comments]
					FROM [AMC_tblUsers] TU WITH (NOLOCK)
					Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					on TU.coluserID=TS.colParentID
					inner join [dbo].[AMC_tblReportCard] RC WITH (NOLOCK)
					ON TS.colStudentID=RC.mStudentID
					inner join #ClassSummary CS
					on CS.mGroup=RC.[mGroup]
					and CS.mExamDate=RC.mExamDate
					and CS.mType=RC.mType
					where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
					and  RC.[mExamDate]>=@ReportDate
					Order by RC.mReportCardID desc
 				END
 
Drop table #ClassSummary
 
END