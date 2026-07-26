CREATE PROCEDURE [dbo].[AMC_spDocuments] 
@Username varchar(100)= null
AS
BEGIN

	-----Find the Usertype--------------------------------------------------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @DocID int
	Declare @ChapterID int
	Declare @Nextsemester varchar(5)
	Declare @DocAdminAccessID int
	Declare @Currentsemester varchar(5)
	--------Assign the default values---------------------------------------------------
	Select	@sUserType=MemberType
			,@iUserID=pMemberID
			,@ChapterID=ChapterID
			,@DocAdminAccessID=pMemberID 
	from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	Select @Currentsemester= semester,@Nextsemester=NextSemester, @DocID=DisplayDocumentsFrom from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) 
	Where Active=1
	--------Authorized Chapter Docs lit---------------------------------------------------
	Create table #Eligiableclass (Class Char (2))
	IF @sUserType='A' 
			BEGIN 
				Insert into #Eligiableclass 
				Select Distinct Class from AMC_ClassType with (NOLOCK) 
				where  ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
			END 
	ELSE
			BEGIN 
				Insert into #Eligiableclass 
				Select Distinct Class from AMC_ClassType with (NOLOCK) 
				where ChapterID=@ChapterID
			END 	
	------------Admin ----------------------------
	IF @sUserType='I' and @DocAdminAccessID in (6678,11641)
			BEGIN 
				 	SELECT 
						  Row_Number() OVER(order by DM.mdocId) as mDocID 
						,[DocumentID]= Case when DM.Active=0 then DM.mDocID
									Else 0
									END 
						,DM.[mDescription] [Description] 
						,DM.[mTopics] [Topics]
						,[mGrade]
						,DM.[mBatch] [mBatch]
						,DM.[mSession] [mSession]
					 	,Convert( Varchar(10),DM.InsertDate, 101 ) [InsertDate]
						,[mDocName]
						,TV.[mURLName] AS [mURLName]
						,[Status] =Case	when DM.Active=1 Then 'Y' 	
									    else  'N' 	
								   END
						,[Class] =Case	when TV.mBatch='JB' Then 'Junior Beginner' 	
										when TV.mBatch='JI' Then 'Junior Intermediate' 	
										when TV.mBatch='JA' Then 'Junior Advanced' 	
										when TV.mBatch='SB' Then 'Senior Beginner'
										when TV.mBatch='SI' Then 'Senior Intermediate'
										when TV.mBatch='SA' Then 'Senior Advanced'	 	
										When TV.mBatch='DS' Then 'Data Science'
										When TV.mBatch='AI' Then 'Artificial Intelligence'
										When TV.mBatch='ED' Then 'Engineering Design'
										when TV.mBatch='GD' Then 'Game Development' 
										when TV.mBatch='AD' Then 'App Development' 
										when TV.mBatch='DM' Then 'Data Management' 
										When TV.mBatch='ST' Then 'PSAT/SAT'
										When TV.mBatch='AT' Then 'ACT'
								END
						FROM  [dbo].[AMC_tblDocuments] DM WITH (NOLOCK)
						Inner Join  [dbo].[AMC_tblVideos] TV WITH (NOLOCK)
						on DM.[mDocID]=TV.[mDocID]
						Where  mDocType='P'
					    --and (DM.Active=1 OR DM.mDescription like '%Lecture Notes%')
						and mDocSession in(@Currentsemester,@Nextsemester)
						and DM.mDocID>@DocID
						and DM.Active=1 
						Order by DM.[mDocID] Desc
					 
		END 

		ELSE IF @sUserType='I'  
			BEGIN 
				 	SELECT 
						  Row_Number() OVER(order by DM.mdocId) as mDocID 
						,[DocumentID]= Case when DM.Active=0 then DM.mDocID
									Else 0
									END 
						,DM.[mDescription] [Description] 
						,DM.[mTopics] [Topics]
						,[mGrade]
						,DM.[mBatch] [mBatch]
						,DM.[mSession] [mSession]
					 	,Convert( Varchar(10),DM.InsertDate, 101 ) [InsertDate]
						,[mDocName]
						,TV.[mURLName] AS [mURLName]
						,[Status] =Case	when DM.Active=1 Then 'Y' 	
									    else  'N' 	
								   END
						,[Class] =Case	when TV.mBatch='JB' Then 'Junior Beginner' 	
										when TV.mBatch='JI' Then 'Junior Intermediate' 	
										when TV.mBatch='JA' Then 'Junior Advanced' 	
										when TV.mBatch='SB' Then 'Senior Beginner'
										when TV.mBatch='SI' Then 'Senior Intermediate'
										when TV.mBatch='SA' Then 'Senior Advanced'	 	
										When TV.mBatch='DS' Then 'Data Science'
										When TV.mBatch='AI' Then 'Artificial Intelligence'
										When TV.mBatch='ED' Then 'Engineering Design'
										when TV.mBatch='GD' Then 'Game Development' 
										when TV.mBatch='AD' Then 'App Development' 
										when TV.mBatch='DM' Then 'Data Management' 
										When TV.mBatch='ST' Then 'PSAT/SAT'
										When TV.mBatch='AT' Then 'ACT'
								END
						FROM  [dbo].[AMC_tblDocuments] DM WITH (NOLOCK)
						inner join [dbo].[AMC_InstructorMaster] IM  WITH (NOLOCK)
						on DM.mBatch=IM.Class
						Inner Join  [dbo].[AMC_tblVideos] TV WITH (NOLOCK)
						on DM.[mDocID]=TV.[mDocID]
						Where  IM.[InstructorID]=@iUserID
						and mDocType='P'
						--and (DM.Active=1 OR DM.mDescription like '%Lecture Notes%')
						and mDocSession in(@Currentsemester,@Nextsemester)
						and DM.mDocID>@DocID
					    and DM.Active=1 
						Order by DM.[mDocID] Desc
					 
		END 


		ELSE IF @sUserType='V'  
			BEGIN 
				 	SELECT 
						  Row_Number() OVER(order by DM.mdocId) as mDocID 
						,[DocumentID]= Case when DM.Active=0 then DM.mDocID
									Else 0
									END 
						,DM.[mDescription] [Description] 
						,DM.[mGrade] [mGrade]
						,DM.[mBatch] [mBatch]
						,DM.[mSession] [mSession]
				 		,Convert( Varchar(10),DM.InsertDate, 101 )  [InsertDate]
						,[mDocName]
						,TV.[mURLName] AS [mURLName]
						,DM.[mTopics] [Topics]
						,[Status] =Case	when DM.Active=1 Then 'Y' 	
									    else  'N' 	
								   END
						,[Class] =Case	when DM.mBatch='JB' Then 'Junior Beginner' 	
										when DM.mBatch='JI' Then 'Junior Intermediate' 	
										when DM.mBatch='JA' Then 'Junior Advanced' 	
										when DM.mBatch='SB' Then 'Senior Beginner'
										when DM.mBatch='SI' Then 'Senior Intermediate'
										when DM.mBatch='SA' Then 'Senior Advanced'	 
										When DM.mBatch='DS' Then 'Data Science'	
										When DM.mBatch='AI' Then 'Artificial Intelligence'
										When DM.mBatch='ED' Then 'Engineering Design'
										when DM.mBatch='GD' Then 'Game Development' 
										when DM.mBatch='AD' Then 'App Development' 
										when DM.mBatch='DM' Then 'Data Management' 
										When DM.mBatch='ST' Then 'PSAT/SAT'
										When DM.mBatch='AT' Then 'ACT'
								END
						FROM  [dbo].[AMC_tblDocuments] DM WITH (NOLOCK)
						inner join [dbo].[AMC_InstructorMaster] IM  WITH (NOLOCK)
						on DM.mBatch=IM.Class
						Inner Join  [dbo].[AMC_tblVideos] TV WITH (NOLOCK)
						on DM.[mDocID]=TV.[mDocID]
						and IM.[InstructorID]=@iUserID
						and mDocType='P'
						and (DM.Active=1 OR DM.[mDescription] like '%Lecture Notes%')
						and Dm.mDocID>@DocID
						and DM.Active=1 
						Order by DM.[mDocID] Desc
					 
		END 
		
		ELSE IF @sUserType='S'  
				BEGIN 
						Declare @CurrentSession varchar(20) 
						Declare @Time time 
						Set @Time=getdate() 
						
						Select @CurrentSession=Session from [dbo].[AMC_ClassSchedule] A 
						inner Join  [dbo].[AMC_tblLookupSemester] B
						On A.ClassDate=b.CurrentExamDate
						where A.chapteriD=1

						CREATE TABLE #Temp_StudentClassDocs
						(
							[mDocID] [int] NULL,
							[DocumentID] int NULL,
							[Topics] [varchar](100) NULL,
							[Description] [varchar](100) NULL,
							[mGrade] [char](2) NULL,
							[mBatch] [char](2) NULL,
							[mSession] [varchar](20) NULL,
							[InsertDate] [datetime] NULL,
							[mDocName] [varchar](100) NULL,
							[mURLName] [varchar](500) NULL,
							[Status] [char](1) NOT NULL,
							[Class] [varchar](30) NOT NULL,
							[ChapterID] int NULL
						)  

						Insert into #Temp_StudentClassDocs
						(
						 [mDocID] 
						,[DocumentID] 
						,[Topics] 
						,[Description] 
						,[mGrade] 
						,[mBatch] 
						,[mSession] 
						,[InsertDate] 
						,[mDocName] 
						,[mURLName] 
						,[Status] 
						,[Class] 
						,[ChapterID]
						) 
						SELECT 
						  Row_Number() OVER(order by DM.mdocId) as mDocID 
						,[DocumentID]= Case when DM.Active=0 then DM.mDocID
									Else 0
									END 
						,DM.mTopics [Topics]
						,DM.mDescription [Description] 
						,[mGrade]
						,DM.[mBatch] [mBatch]
						,DM.[mSession] [mSession]
						,Convert( Varchar(10),DM.InsertDate, 101 ) [InsertDate]
						,DM.[mDocName] [mDocName]
						,TV.[mURLName] AS [mURLName]
						,[Status] =Case	when DM.Active=1 then 'Y'
									    else  'N' 	
								   END
						,[Class] =Case	when DM.mBatch='JB' Then 'Junior Beginner' 	
										when DM.mBatch='JI' Then 'Junior Intermediate' 	
										when DM.mBatch='JA' Then 'Junior Advanced' 	
										when DM.mBatch='SB' Then 'Senior Beginner'
										when DM.mBatch='SI' Then 'Senior Intermediate'
										when DM.mBatch='SA' Then 'Senior Advanced'
										When DM.mBatch='DS' Then 'Data Science'		 	
										When DM.mBatch='AI' Then 'Artificial Intelligence'
										When DM.mBatch='ED' Then 'Engineering Design'
										when DM.mBatch='GD' Then 'Game Development' 
										when DM.mBatch='AD' Then 'App Development' 
										when DM.mBatch='DM' Then 'Data Management' 
										When DM.mBatch='ST' Then 'PSAT/SAT'
										When DM.mBatch='AT' Then 'ACT'
								END
						,iJ.ChapterID ChapterID
						FROM  [dbo].[AMC_tblDocuments] DM WITH (NOLOCK)
						Inner Join  [dbo].[AMC_tblVideos] TV WITH (NOLOCK)
						on DM.[mDocID]=TV.[mDocID]
						inner join
							(
							select  Class mBatch,TS.ChapterID ChapterID
							FROM [AMC_ClassMaster] CM WITH (NOLOCK)
							Inner Join AMC_tblStudents TS  WITH (NOLOCK)
							on CM.StudentID=TS.colStudentID
							inner join AMC_tblUsers TU
							on TU.coluserID=TS.colParentID
							and TS.colStatus='R'
							where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
							and TS.colStudentEnrolledSession in(@Currentsemester,@Nextsemester)
							) iJ
						on DM.mBatch=iJ.mBatch
					 	where  DM.Active=1
						and mDocType='P'
						and mDocSession in(@Currentsemester,@Nextsemester)
						and DM.mDocID>@DocID
						Order by [mDocID] Desc

						Delete from  #Temp_StudentClassDocs where Description like '%Answer Key%' and mSession like '%' + @CurrentSession +  '%'  and ChapterID=1 
						Delete from  #Temp_StudentClassDocs where Description like '%Home Work Solution%' and mSession like '%' + @CurrentSession +  '%'  and ChapterID=1 

						Select  
							 [mDocID] 
							,[DocumentID] 
							,[Topics] 
							,[Description] 
							,[mGrade] 
							,[mBatch] 
							,[mSession] 
							,[InsertDate] 
							,[mDocName] 
							,[mURLName] 
							,[Status] 
							,[Class] 
						from #Temp_StudentClassDocs Order by [mDocID] Desc

						Drop table #Temp_StudentClassDocs

				END 
		ELSE 
				BEGIN 
					
				
					SELECT 
						  Row_Number() OVER(order by DM.mdocId) as mDocID 
						,[DocumentID]= Case when DM.Active=0 then DM.mDocID
									Else 0
									END 
						,DM.[mDescription] AS [Description] 
						,DM.[mTopics] AS [Topics]
						,[mGrade]
						,DM.[mBatch] AS [mBatch]
						,DM.[mSession] AS [mSession]
						,Convert( Varchar(10),DM.InsertDate, 101 ) [InsertDate]
						,[mDocName]
						,TV.[mURLName] AS [mURLName]
						,[Status] =Case	when DM.Active=1 Then 'Y' 	
									    else  'N' 	
								   END
						,[Class] =Case	when DM.mBatch='JB' Then 'Junior Beginner' 	
										when DM.mBatch='JI' Then 'Junior Intermediate' 	
										when DM.mBatch='JA' Then 'Junior Advanced' 	
										when DM.mBatch='SB' Then 'Senior Beginner'
										when DM.mBatch='SI' Then 'Senior Intermediate'
										when DM.mBatch='SA' Then 'Senior Advanced'
										When DM.mBatch='DS' Then 'Data Science'		 	
										When DM.mBatch='AI' Then 'Artificial Intelligence'
										When DM.mBatch='ED' Then 'Engineering Design'
										when DM.mBatch='GD' Then 'Game Development' 
										when DM.mBatch='AD' Then 'App Development' 
										when DM.mBatch='DM' Then 'Data Management' 
										When DM.mBatch='ST' Then 'PSAT/SAT'
										When DM.mBatch='AT' Then 'ACT'
								END
						FROM  [dbo].[AMC_tblDocuments] DM WITH (NOLOCK)
						Inner Join  [dbo].[AMC_tblVideos] TV WITH (NOLOCK)
						on DM.[mDocID]=TV.[mDocID]
						Where mDocType='P' 
						and mDocSession in(@Currentsemester,@Nextsemester)
						and DM.mBatch in (Select Class from #Eligiableclass)	
						and  DM.mDocID>@DocID
						Order by DM.[mdocId] Desc
				END 
	-------------Drop temp table -------------------
	Drop table #Eligiableclass

END