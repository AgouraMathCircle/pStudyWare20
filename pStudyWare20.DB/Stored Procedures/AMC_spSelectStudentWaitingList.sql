CREATE  proc [dbo].[AMC_spSelectStudentWaitingList] 
 @WaitingForOnSite Char(1)='N',
 @userName varchar (100)
AS
BEGIN
	-------------populate the Duplicate Application -----------------------------
	Create table #DuplicateCheck
	(StudentID int
	,colStudentFName varchar(50)
	,colStudentLName varchar(50)
	,coluserEmail varchar(100)
	,Class Char(2)
	,ApplicationStatus varchar(20) Default 'NEW'
	,ExistingID int
	)
	Insert into #DuplicateCheck
	(StudentID
	,colStudentFName
	,colStudentLName
	,coluserEmail
	,Class
	)
	SELECT TS.[colStudentID]  
		  ,TS.[colStudentFName]
		  ,TS.[colStudentLName] 
		  ,TU.[coluserEmail] 
		  ,CM.Class
		  FROM [AMC_tblUsers] TU WITH (NOLOCK)
		  Inner Join AMC_tblStudents TS  WITH (NOLOCK)
		  on TU.coluserID=TS.colParentID
		  inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
	      on TS.colStudentID=CM.StudentID
		  inner join MemberMaster MM WITH (NOLOCK)
		  on  upper(ltrim(MM.Username))=upper(ltrim(TU.coluserEmail))
		  inner Join [dbo].[AMC_ChapterMaster] CH WITH (NOLOCK)
		  on CH.ChapterID=TS.ChapterID
		  Where  TS.[colStatus] ='W' 
		  and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))		
		Order by TS.[colStudentID]  

		Update #DuplicateCheck Set ExistingID=Oj.ExistingID,ApplicationStatus='Duplicate:' + cast(Oj.ExistingID as varchar(8)) From #DuplicateCheck iJ with (NOLOCK)
		inner join (
		Select A.StudentID CurrentID,B.colStudentID ExistingID from #DuplicateCheck A Inner Join(
 			SELECT TS.[colStudentID]  
				  ,TS.[colStudentFName]
				  ,TS.[colStudentLName] 
				  ,TU.[coluserEmail] 
				  ,CM.Class
				  FROM [AMC_tblUsers] TU WITH (NOLOCK)
				  Inner Join AMC_tblStudents TS  WITH (NOLOCK)
				  on TU.coluserID=TS.colParentID
				  inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
				  on TS.colStudentID=CM.StudentID
				  inner join MemberMaster MM WITH (NOLOCK)
				  on  upper(ltrim(MM.Username))=upper(ltrim(TU.coluserEmail))
				  inner Join [dbo].[AMC_ChapterMaster] CH WITH (NOLOCK)
				  on CH.ChapterID=TS.ChapterID
				  Where  TS.[colStatus] ='R' 
			     and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))) B
				 on lower(ltrim(A.colStudentFName))=lower(ltrim(B.colStudentFName))
			and lower(ltrim(A.colStudentLName))=lower(ltrim(B.colStudentLName))
			and A.Class=B.Class
			and lower(ltrim(A.coluserEmail))=lower(ltrim(B.coluserEmail))) Oj
		on oj.CurrentID=iJ.StudentID
	
	---------------------Create temp table --------------------------------------
	IF @WaitingForOnSite='Y'
		BEGIN
			SELECT TS.[colStudentID]  As StudentID
						,TS.[colStudentFName]+ ' '+ TS.[colStudentLName] As StudentName
						,TS.[colStudentEmail] As StudentEmail
						,TS.[colStudentSchool] As School
						,TS.[colStudentGrade] As Grade
						,TU.[coluserfName] + ' ' + TU.[coluserlName] As ParentName
						,TU.[coluserCity] As City
						,TU.[coluserState] As State
						,TU.[coluserCountry] As Country
						,TU.[coluserPhNo] As PhoneNumber
						,TU.[coluserEmail] As EmailAddress
						,TS.[colStudentEnrolledSession] As EventSession
						,Class =Case when  CM.Class='DS' Then 'Data Science' 
							when  CM.Class='AI' Then 'Artificial Intelligence'  
							when  CM.Class='GD' Then 'Game Development' 
							when  CM.Class='AD' Then 'App Development' 
							when  CM.Class='DM' Then 'Data Management'
							When  CM.Class='ED' then 'Engineering Design'
							when  CM.Class='ST' Then 'PSAT'
							when  CM.Class='AT' Then 'ACT'
							when  CM.Class='JB' Then 'Junior Beginner' 	
							when  CM.Class='JI' Then 'Junior Intermediate' 	
							when  CM.Class='JA' Then 'Junior Advanced' 	
							when  CM.Class='SB' Then 'Senior Beginner'
							when  CM.Class='SI' Then 'Senior Intermediate'
							when  CM.Class='SA' Then 'Senior Advanced'
						END 	
						,EventLocation =CH.Name
					,TU.[RegisteredDate] As RegisteredDate
					,TS.[colStudentFName]+ 'E$~#'+ TS.[colStudentLName] + 'E$~#'+ CM.[Class] + 'E$~#'+ TU.[coluserEmail] + 'E$~#'+ TS.[colStudentEnrolledSession] + 'E$~#'+ TS.[colStudentGrade] + 'E$~#'+ TS.[ColEventLocation]  + 'E$~#'+ cast(CH.ChapterID as Char(1)) + 'E$~#'+ MM.[Password] As StudentClassInfo 
					,MM.[Password]
					,'Existing' [ApplicationStatus]
					FROM [AMC_tblUsers] TU WITH (NOLOCK)
					Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					on TU.coluserID=TS.colParentID
					inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
					on TS.colStudentID=CM.StudentID
					inner join MemberMaster MM WITH (NOLOCK)
					on  upper(ltrim(MM.Username))=upper(ltrim(TU.coluserEmail))
					inner Join [dbo].[AMC_ChapterMaster] CH WITH (NOLOCK)
					on CH.ChapterID=TS.ChapterID
					Where   TS.RequestedLocation='O' and ColEventLocation='I'
					and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))		
					Order by [RegisteredDate] Desc
			END
		ELSE
		  BEGIN
			   SELECT TS.[colStudentID]  As StudentID
						,TS.[colStudentFName]+ ' '+ TS.[colStudentLName] As StudentName
						,TS.[colStudentEmail] As StudentEmail
						,TS.[colStudentSchool] As School
						,TS.[colStudentGrade] As Grade
						,TU.[coluserfName] + ' ' + TU.[coluserlName] As ParentName
						,TU.[coluserCity] As City
						,TU.[coluserState] As State
						,TU.[coluserCountry] As Country
						,TU.[coluserPhNo] As PhoneNumber
						,TU.[coluserEmail] As EmailAddress
						,TS.[colStudentEnrolledSession] As EventSession
						,Class =Case  when CM.Class='DS' Then 'Data Science' 
							when  CM.Class='AI' Then 'Artificial Intelligence'   
							when  CM.Class='GD' Then 'Game Development' 
							when  CM.Class='AD' Then 'App Development' 
							when  CM.Class='DM' Then 'Data Management' 
							When  CM.Class='ED' then 'Engineering Design'
							when  CM.Class='ST' Then 'PSAT'
							when  CM.Class='AT' Then 'ACT'
							when  CM.Class='JB' Then 'Junior Beginner' 	
							when  CM.Class='JI' Then 'Junior Intermediate' 	
							when  CM.Class='JA' Then 'Junior Advanced' 	
							when  CM.Class='SB' Then 'Senior Beginner'
							when  CM.Class='SA' Then 'Senior Advanced'	 	
						END 	
						,EventLocation =CH.Name
					,TU.[RegisteredDate] As RegisteredDate
					,TS.[colStudentFName]+ 'E$~#'+ TS.[colStudentLName] + 'E$~#'+ CM.[Class] + 'E$~#'+ TU.[coluserEmail] + 'E$~#'+ TS.[colStudentEnrolledSession] + 'E$~#'+ TS.[colStudentGrade] + 'E$~#'+ TS.[ColEventLocation]  + 'E$~#'+ cast(CH.ChapterID as Char(1)) + 'E$~#'+ MM.[Password] As StudentClassInfo 
					,MM.[Password]
					,DC.ApplicationStatus [ApplicationStatus]
					FROM [AMC_tblUsers] TU WITH (NOLOCK)
					Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					on TU.coluserID=TS.colParentID
					inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
					on TS.colStudentID=CM.StudentID
					inner join MemberMaster MM WITH (NOLOCK)
					on  upper(ltrim(MM.Username))=upper(ltrim(TU.coluserEmail))
					inner Join [dbo].[AMC_ChapterMaster] CH WITH (NOLOCK)
					on CH.ChapterID=TS.ChapterID
					Inner Join #DuplicateCheck DC WITH (NOLOCK)
					On DC.StudentID=TS.colStudentID
					Where  TS.[colStatus] ='W' 
					and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))		
					--and TS.ChapterID =	7
					Order by [RegisteredDate] Desc
			END

			Drop table #DuplicateCheck
END