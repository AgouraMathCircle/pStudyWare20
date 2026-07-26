CREATE  proc [dbo].[AMC_spReportCard1] 
@Username varchar(100)= 'ALL'
,@ReportCardID int=0
AS
BEGIN
  
	-------Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @ClassAccess char(1)
	
	Select @sUserType=MemberType,@iUserID=pMemberID,@ClassAccess=ClassAccess from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	Declare @ReportDate Date
	Declare @CurrentSemster Char(5)
	Select @ReportDate=DateAdd(d,-1,StartingDate),@CurrentSemster=semester from AMC_tblLookupSemester with (NOLOCK) 
	Where Active=1

	--Set @ReportDate='12/16/2023'
	---------------Calculate the Top Score and Avg Score------------------
	Create table #ClassSummary(mGroup varchar(50),mSection Char(1), mExamDate dateTime,mType varchar(30),TopScore int,ClassAvgScore float)

	Insert into #ClassSummary (mGroup,mExamDate,mType,mSection,ClassAvgScore,TopScore)
	Select mGroup,mExamDate,mType,CM.Section, Round(avg(mReceivedPoints),0) ClassAvgScore,max(mReceivedPoints) from [AMC_tblReportCard] RC With (NOLOCK) 
	inner join  [dbo].[AMC_ClassMaster] CM  With (NOLOCK) 
	on RC.mStudentID=CM.[StudentID]
	Where mExamDate>@ReportDate
	group by mGroup,mExamDate,mType, CM.Section
 
 	IF @sUserType='I' and  @ClassAccess='A'
		BEGIN 
			SELECT  Top 500 TS.[colStudentID]  As StudentID
			,RC.mReportCardID [ReportCardID]
			,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
			,TS.[colStudentSchool] As School
			,TS.[colStudentGrade] As Grade
			,RC.[mSemster] As Semester
			,RC.[mType] [ExamType]
			,Convert( Varchar(10), RC.[mExamDate], 101 )  [ExamDate]
			,RC.[mTotalPoints] [TotalCredit]
			,CS.TopScore HighestScore
			,CS.ClassAvgScore ClassAverage 
			,RC.[mReceivedPoints] [ReceivedCredit]
			,RC.[mGroup] [Group]
			,RC.[mComments] [Comments]
			,RC.[InsertDate] [SubmittedDate],
			(Case when SUBSTRING(CL.Semester,1,1)='F' then 'Fall ' + CL.Session
								 when SUBSTRING(CL.Semester,1,1)='S' then 'Spring ' + CL.Session
							END) as [FallSession]
			FROM [AMC_tblUsers] TU WITH (NOLOCK)
			Inner Join AMC_tblStudents TS  WITH (NOLOCK)
			on TU.coluserID=TS.colParentID
			inner join [dbo].[AMC_tblReportCard] RC WITH (NOLOCK)
			ON TS.colStudentID=RC.mStudentID
			inner join #ClassSummary CS
					on CS.mGroup=RC.[mGroup]
					and CS.mExamDate=RC.mExamDate
					and CS.mType=RC.mType
			inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			on CM.[StudentID]=RC.mStudentID
			and CM.[Section]= CS.[mSection] 
			inner join   [AMC_ClassSchedule] CL 
					on CL.ClassDate = RC.mExamDate
					and CL.ChapterID=RC.ChapterID
			where  RC.[mExamDate]>@ReportDate
			--and TS.[colStudentID] in 
			--				( 
			--				  Select StudentID from [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			--				  inner join AMC_InstructorMaster IM  WITH (NOLOCK)
			--				  on CM.Class=IM.Class
			--				  and CM.Section=IM.Section
			--				  where IM.InstructorID=@iUserID
			--				)
			and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
			Order by RC.mReportCardID desc
 		END
	ELSE IF @sUserType='I' and  @ClassAccess='N'
		BEGIN 
			SELECT  Top 500 TS.[colStudentID]  As StudentID
			,RC.mReportCardID [ReportCardID]
			,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
			,TS.[colStudentSchool] As School
			,TS.[colStudentGrade] As Grade
			,RC.[mSemster] As Semester
			,RC.[mType] [ExamType]
			,Convert( Varchar(10), RC.[mExamDate], 101 )  [ExamDate]
			,RC.[mTotalPoints] [TotalCredit]
			,CS.TopScore HighestScore
			,CS.ClassAvgScore ClassAverage 
			,RC.[mReceivedPoints] [ReceivedCredit]
			,RC.[mGroup] [Group]
			,RC.[mComments] [Comments]
			,RC.[InsertDate] [SubmittedDate],
			(Case when SUBSTRING(CL.Semester,1,1)='F' then 'Fall ' + CL.Session
								 when SUBSTRING(CL.Semester,1,1)='S' then 'Spring ' + CL.Session
							END) as [FallSession]
			FROM [AMC_tblUsers] TU WITH (NOLOCK)
			Inner Join AMC_tblStudents TS  WITH (NOLOCK)
			on TU.coluserID=TS.colParentID
			inner join [dbo].[AMC_tblReportCard] RC WITH (NOLOCK)
			ON TS.colStudentID=RC.mStudentID
			inner join #ClassSummary CS
					on CS.mGroup=RC.[mGroup]
					and CS.mExamDate=RC.mExamDate
					and CS.mType=RC.mType
			inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			on CM.[StudentID]=RC.mStudentID
			and CM.[Section]= CS.[mSection] 
			inner join   [AMC_ClassSchedule] CL 
					on CL.ClassDate = RC.mExamDate
					and CL.ChapterID=RC.ChapterID
			where  TS.[colStudentID] in 
							( 
							  Select StudentID from [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
							  inner join AMC_InstructorMaster IM  WITH (NOLOCK)
							  on CM.Class=IM.Class
							  and CM.Section=IM.Section
							  where IM.InstructorID=@iUserID
							)
			and RC.[mExamDate]>@ReportDate
			and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
			Order by RC.mReportCardID desc
		END	

		ELSE IF @ReportCardID>0 
				BEGIN 
					SELECT Top 500 TS.[colStudentID]  As StudentID
					,RC.mReportCardID [ReportCardID]
					,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
					,TS.[colStudentSchool] As School
					,TS.[colStudentGrade] As Grade
					,RC.[mSemster] As Semester
					,RC.[mType] [ExamType]
					,Convert( Varchar(10), RC.[mExamDate], 101 )  [ExamDate]
					,RC.[mTotalPoints] [TotalCredit]
					,CS.TopScore HighestScore
					,CS.ClassAvgScore ClassAverage 
					,RC.[mReceivedPoints] [ReceivedCredit]
					,RC.[mGroup] [Group]
					,RC.[mComments] [Comments]
					,RC.[InsertDate] [SubmittedDate],
					(Case when SUBSTRING(CL.Semester,1,1)='F' then 'Fall  ' + CL.Session
								 when SUBSTRING(CL.Semester,1,1)='S' then 'Spring ' + CL.Session
							END) as [FallSession]
					FROM AMC_tblStudents TS  WITH (NOLOCK)
					inner join [dbo].[AMC_tblReportCard] RC WITH (NOLOCK)
					on TS.colStudentID=RC.mStudentID
					inner join #ClassSummary CS
					on CS.mGroup=RC.[mGroup]
					and CS.mExamDate=RC.mExamDate
					and CS.mType=RC.mType
					inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
					on CM.[StudentID]=RC.mStudentID
					and CM.[Section]= CS.[mSection] 
					inner join   [AMC_ClassSchedule] CL 
					on CL.ClassDate = RC.mExamDate
					and CL.ChapterID=RC.ChapterID
					Where RC.mReportCardID=@ReportCardID
					 
 				END
		 ELSE IF (@sUserType='S')
				BEGIN 
					SELECT TS.[colStudentID]  As StudentID
					,RC.mReportCardID [ReportCardID]
					,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
					,TS.[colStudentSchool] As School
					,TS.[colStudentGrade] As Grade
					,RC.[mSemster] As Semester
					,RC.[mType] [ExamType]
					,Convert( Varchar(10), RC.[mExamDate], 101 )  [ExamDate]
					,RC.[mTotalPoints] [TotalCredit]
					,CS.TopScore HighestScore
					,CS.ClassAvgScore ClassAverage 
					,RC.[mReceivedPoints] [ReceivedCredit]
					,RC.[mGroup] [Group]
					,RC.[mComments] [Comments]
					,RC.[InsertDate] [SubmittedDate],
					(Case when SUBSTRING(CL.Semester,1,1)='F' then 'Fall  ' + CL.Session
								 when SUBSTRING(CL.Semester,1,1)='S' then 'Spring ' + CL.Session
							END) as [FallSession]
					FROM [AMC_tblUsers] TU WITH (NOLOCK)
					Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					on TU.coluserID=TS.colParentID
					inner join [dbo].[AMC_tblReportCard] RC WITH (NOLOCK)
					ON TS.colStudentID=RC.mStudentID
					inner join #ClassSummary CS
					on CS.mGroup=RC.[mGroup]
					and CS.mExamDate=RC.mExamDate
					and CS.mType=RC.mType
					inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
					on CM.[StudentID]=RC.mStudentID
					and CM.[Section]= CS.[mSection] 
					inner join   [AMC_ClassSchedule] CL 
					on CL.ClassDate = RC.mExamDate
					and CL.ChapterID=RC.ChapterID
					where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
					Order by RC.mReportCardID desc
 				END
		ELSE 
				BEGIN 
					SELECT top 500 TS.[colStudentID]  As StudentID
					,RC.mReportCardID [ReportCardID]
					,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
					,TS.[colStudentSchool] As School
					,TS.[colStudentGrade] As Grade
					,RC.[mSemster] As Semester
					,RC.[mType] [ExamType]
					,Convert( Varchar(10), RC.[mExamDate], 101 )  [ExamDate]
					,RC.[mTotalPoints] [TotalCredit]
					,CS.TopScore HighestScore
					,CS.ClassAvgScore ClassAverage 
					,RC.[mReceivedPoints] [ReceivedCredit]
					,RC.[mGroup]  As [Group]
					,RC.[mComments] [Comments]
					,RC.[InsertDate] [SubmittedDate],
					(Case when SUBSTRING(CL.Semester,1,1)='F' then 'Fall  ' + CL.Session
								 when SUBSTRING(CL.Semester,1,1)='S' then 'Spring ' + CL.Session
							END) as [FallSession]
					FROM [AMC_tblUsers] TU WITH (NOLOCK)
					Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					on TU.coluserID=TS.colParentID
					inner join [dbo].[AMC_tblReportCard] RC WITH (NOLOCK)
					ON TS.colStudentID=RC.mStudentID
					inner join #ClassSummary CS WITH (NOLOCK)
					on CS.mGroup=RC.[mGroup]
					and CS.mExamDate=RC.mExamDate
					and CS.mType=RC.mType
					inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
					on CM.[StudentID]=RC.mStudentID
					and CM.[Section]= CS.[mSection] 
					inner join   [AMC_ClassSchedule] CL 
					on CL.ClassDate = RC.mExamDate
					and CL.ChapterID=RC.ChapterID
					Where TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
					and  RC.[mExamDate]>@ReportDate
					Order by RC.mReportCardID desc

 				END

Drop table #ClassSummary
 
END