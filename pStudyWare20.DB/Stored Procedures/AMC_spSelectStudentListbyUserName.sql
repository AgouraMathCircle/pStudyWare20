CREATE proc [dbo].[AMC_spSelectStudentListbyUserName] 
@Username varchar(100),
@EmailMode char(1) ='O',
@DisplayMode char(1) =''
AS
BEGIN


	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @EmailClassAll varchar(100)
	Declare @ChapterID int 
	Declare @Currentsemester varchar(5)
	Declare @Nextsemester varchar(5)
	Declare @ClassAccess char(1)

	Set @ClassAccess='N'


	Select @sUserType=MemberType,@iUserID=pMemberID,@ChapterID=ChapterID,@ClassAccess=ClassAccess from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))
	    
    ----Find Email Group ----------------------------
	Select @EmailClassAll=[InstructorEmailGroup] from AMC_ClassType CT WITH (NOLOCK)
	Inner Join [AMC_InstructorMaster] IM WITH (NOLOCK)
	on IM.Class=CT.Class and IM.Section=CT.Section
	where CT.chapterID=@ChapterID
	and  IM. [InstructorID]=@iUserID

	---------------Getting Current Semster--------
	Select @Currentsemester= semester,@Nextsemester=NextSemester from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) Where Active=1

		IF  @sUserType='S'  and @DisplayMode='H'
				BEGIN
					SELECT 
					 TU.coluserEmail + '~'+  convert(char(10),TS.[colStudentID]) As StudentID
					,TS.[colStudentFName]+ ' '+ [colStudentLName] + ' (' + CM.Name +')'  As StudentName
					FROM [AMC_tblUsers] TU WITH (NOLOCK)
					Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					on TU.coluserID=TS.colParentID
					inner join AMC_ChapterMaster CM  WITH (NOLOCK)
					On TS.ChapterID=CM.ChapterID
				  where 
				  upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
				  and TS.[colStudentEnrolledSession] in(@Currentsemester,@Nextsemester)
				  and TS.[colStatus]='R'
				  and TS.ChapterID in (3,4,7)
				  Order by TS.[colStudentFName]
				END

		ELSE IF @sUserType='S'  
			BEGIN 
 			  
			Create Table #TempStudentList(StudentID int
			,StudentName Varchar(50)
			,InstructorID int
			,InstructorEMailID varchar(100)
			,InstructorClass varchar(2)
			,InstructorSection char(1)
			,InstructorEmailGroup varchar(100)
			,ChapterID int
			,ChapterName varchar(100)
			)
			Insert into #TempStudentList(StudentID, StudentName,ChapterID)
			SELECT TS.[colStudentID] As StudentID
			,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
			,TS.ChapterID ChapterID
				FROM [AMC_tblUsers] TU WITH (NOLOCK)
			Inner Join AMC_tblStudents TS  WITH (NOLOCK)
			on TU.coluserID=TS.colParentID 
			where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
			and TS.[colStudentEnrolledSession] in(@Currentsemester,@Nextsemester)
			and TS.[colStatus]='R'
			Order by TS.[colStudentGrade]

			Update #TempStudentList Set InstructorID=OJ.InstructorID,InstructorClass=Oj.Class,InstructorSection=oj.Section From #TempStudentList iJ
			Inner Join 
			(
			 Select A.StudentID StudentID,C.[InstructorID] InstructorID,C.Class Class,C.Section Section  from [dbo].[AMC_ClassMaster] A
			 inner join #TempStudentList  B  WITH (NOLOCK)
			 on A.StudentID=B.[StudentID]
			 inner join [dbo].[AMC_InstructorMaster] C  WITH (NOLOCK)
			 on A.Class=C.Class
			 and A.Section=C.Section
			 inner join [MemberMaster] D
			 on C.InstructorID=D.pMemberID
			 where C.Type in ('C','P')
			 ) OJ
			 On iJ.StudentID=Oj.StudentID
  
			Update #TempStudentList Set ChapterName=case when Rtrim(CM.Location)='Internet' then CM.Program + ' - '+ CM.Name  
					else CM.Program + ' - '+ CM.Name  
				    end
			From #TempStudentList TL WITH (NOLOCK)
			inner Join [AMC_ChapterMaster]  CM WITH (NOLOCK)
			On TL.ChapterID=CM.ChapterID				 
 
			Update #TempStudentList set InstructorEMailID=MM.EmailID
			From #TempStudentList TS  WITH (NOLOCK)
			inner join [dbo].[MemberMaster] MM  WITH (NOLOCK)
			on TS.InstructorID=MM.[pMemberID]

		--	select * from #TempStudentList

			Update #TempStudentList set InstructorEmailGroup=CT.InstructorEmailGroup
			From #TempStudentList TS  WITH (NOLOCK)
			inner join [dbo].[AMC_ClassType] CT WITH (NOLOCK)
			on TS.InstructorClass=CT.[Class]
			and TS.InstructorSection=CT.section
			and TS.ChapterID=CT.ChapterID
			
			--IF @DisplayMode='E' 
			--	BEGIN 
			--	 Delete From #TempStudentList where StudentID
			--		in(
			--		Select mStudentID from [AMC_tblReportCard] RC WITH (NOLOCK)
			--		Inner Join AMC_tblLookupSemester LS WITH (NOLOCK)
			--		ON LS.CurrentExamDate=RC.mExamDate
			--		Inner Join #TempStudentList TS WITH (NOLOCK)
			--		ON TS.StudentID=RC.mStudentID
			--		Where RC.mType='Final Exam'
			--		)
			--	END
		--select * from #TempStudentList
			IF 	@DisplayMode='S'
				BEGIN 			
					 Select  InstructorEmailGroup + '~'+  rtrim(convert(char(10),StudentID)) As StudentID
							,StudentName + ' (' + InstructorClass +')' AS StudentName
					 from #TempStudentList order by StudentName
				END
		   ELSE IF @DisplayMode='O'
				BEGIN 			
					 Select  rtrim(convert(char(10),ChapterID))  + '~'+  rtrim(convert(char(10),StudentID)) As StudentID
						,StudentName + ' (' + ChapterName +')' AS StudentName
					 from #TempStudentList order by StudentName
				END
			ELSE  IF @DisplayMode='E' 
				BEGIN 			
					 Create Table #StudentList(
					  RowID int Identity(1,1)
					 ,StudentID varchar(20)
					 ,StudentName Varchar(100)
					 )
					 ---Default Value------------------------------
					 Insert into #StudentList(StudentID,StudentName) values('OO~0~0','Select Student')
					 ------------Add the Student List---------------
					 Insert into #StudentList(StudentID,StudentName)
					 Select  InstructorClass + '~'+  rtrim(convert(char(10),StudentID)) + '~'+  convert(char(10),ChapterID) As StudentID
						,StudentName + ' (' + ChapterName +')' AS StudentName
					 from #TempStudentList 
					 where ChapterID<>1
					 order by StudentName
					 ----Display the Student List-----------------
					 Select StudentID,StudentName from #StudentList with (NOLOCK) Order by RowID
					 ---Cleanup--------------------------------------
					 Drop table #StudentList

				END
		    ELSE   
				BEGIN 			
					 Select  InstructorEmailGroup + '~'+  rtrim(convert(char(10),StudentID)) As StudentID
						,StudentName + ' (' + ChapterName +')' AS StudentName
					 from #TempStudentList order by StudentName
				END

			Drop table #TempStudentList

		--	select * from #TempStudentEmailList

		    END 

			ELSE IF @sUserType='I'  
					BEGIN 
					    Create table #TempStudentEmailList
								(RowID int identity(1,1)
								,StudentID varchar(200)
								,StudentName varchar(100)
								)

						IF @EmailMode='I'
							BEGIN
								Insert into #TempStudentEmailList
								(StudentID
								,StudentName) Values
								(@EmailClassAll + '~0'
								,'ALL'
								)
									
							END 
					IF @ClassAccess='A'
						BEGIN 
							Insert into #TempStudentEmailList
							SELECT
 							 TU.coluserEmail + '~'+  convert(char(10),TS.[colStudentID]) As StudentID
							,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
							FROM  [AMC_tblUsers] TU WITH (NOLOCK)
							Inner Join AMC_tblStudents TS  WITH (NOLOCK)
							on TU.coluserID=TS.colParentID
							where  TS.[colStudentID] in 
									( 
											Select StudentID from [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
											inner join [AMC_InstructorMaster] IM  WITH (NOLOCK)
											on CM.Class=IM.Class
											--and CM.Section=IM.Section
											where IM.InstructorID=@iUserID
											and IM.ChapterID=@ChapterID
									)
							and TS.colStudentEnrolledSession in(@Currentsemester,@Nextsemester)
							and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
							Order by TS.[colStudentFName]
					     END 
					

					ELSE 
						BEGIN 
							Insert into #TempStudentEmailList
							SELECT
 							 TU.coluserEmail + '~'+  convert(char(10),TS.[colStudentID]) As StudentID
							,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
							FROM  [AMC_tblUsers] TU WITH (NOLOCK)
							Inner Join AMC_tblStudents TS  WITH (NOLOCK)
							on TU.coluserID=TS.colParentID
							where  TS.[colStudentID] in 
									( 
											Select StudentID from [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
											inner join [AMC_InstructorMaster] IM  WITH (NOLOCK)
											on CM.Class=IM.Class
											and CM.Section=IM.Section
											where IM.InstructorID=@iUserID
											and IM.ChapterID=@ChapterID
									)
							and TS.colStudentEnrolledSession in(@Currentsemester,@Nextsemester)
							and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
							Order by TS.[colStudentFName]
					     END 

 					 Select StudentID,StudentName from #TempStudentEmailList Order by RowID 

					-- Drop table #TempStudentEmailList
				--	select * from #TempStudentEmailList
	 	
					END 
		ELSE IF @sUserType='V' 
				BEGIN
					Select 'support@agouramathcircle.org'+ '~'+  ltrim(convert(char(10),@iUserID)) StudentID, 'Administrator' StudentName
				END 
			ELSE

			  BEGIN 
				SELECT 
					 TU.coluserEmail + '~'+  convert(char(10),TS.[colStudentID]) As StudentID
					,TS.[colStudentFName]+ ' '+ [colStudentLName] + '(' +  convert(char(10),TS.[colStudentID]) +')'  As StudentName
					FROM [AMC_tblUsers] TU WITH (NOLOCK)
					Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					on TU.coluserID=TS.colParentID
				  where TS.[colStudentEnrolledSession] in(@Currentsemester,@Nextsemester)
				  and TS.[colStatus]='R'
				  and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
				  Order by TS.[colStudentFName]
		    END 
END