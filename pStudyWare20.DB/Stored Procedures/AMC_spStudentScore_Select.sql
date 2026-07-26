CREATE proc [dbo].[AMC_spStudentScore_Select] 
@Username varchar(100)= 'ALL'
AS
BEGIN

	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Select @sUserType=MemberType,@iUserID=pMemberID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

		SELECT TS.[colStudentID]  As StudentID
		,RC.mReportCardID [ReportCardID]
		,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
		,TS.[colStudentSchool] As School
		,TS.[colStudentGrade] As Grade
		,RC.[mSemster] As Semester
		,RC.[mType] [ExamType]
		,Convert( Varchar(10), RC.[mExamDate], 101 )  [ExamDate]
		,RC.[mTotalPoints] [TotalCredit]
		,RC.[mReceivedPoints] [ReceivedCredit]
		,RC.[mGroup] [Group]
		,RC.[mComments] [Comments]
		,RC.[InsertDate] [SubmittedDate]
		,CurrentSession=Case when SUBSTRING(CL.Semester,1,1)='F' then 'Fall ' + CL.Session
								 when SUBSTRING(CL.Semester,1,1)='S' then 'Spring ' + CL.Session
							END  
		FROM [AMC_tblUsers] TU WITH (NOLOCK)
		Inner Join AMC_tblStudents TS  WITH (NOLOCK)
		on TU.coluserID=TS.colParentID
		inner join [dbo].[AMC_tblReportCard] RC WITH (NOLOCK)
		ON TS.colStudentID=RC.mStudentID
		inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
		on CM.[StudentID]=RC.mStudentID
		inner join   [AMC_ClassSchedule] CL 
		on CL.ClassDate = RC.mExamDate
		and CL.ChapterID=RC.ChapterID
		where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
		Order by RC.mReportCardID desc
END