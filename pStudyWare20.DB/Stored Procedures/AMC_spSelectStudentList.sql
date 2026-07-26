CREATE proc [dbo].[AMC_spSelectStudentList] 
@Username varchar(100)= null
,@Mode char(1) =null
,@ChapterID int =null 
,@Source varchar(10)=null
AS
BEGIN

	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @ClassAccess char(1)
	Select @sUserType=MemberType,@iUserID=pMemberID,@ClassAccess=ClassAccess from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	Declare @Currentsemester varchar(5)
	Declare @Nextsemester Varchar(5)
	Declare @Lastsemester Varchar(5)
	Select @Currentsemester= semester,@Nextsemester=Nextsemester,@Lastsemester =Lastsemester from [dbo].[AMC_tblLookupSemester] 
	WITH (NOLOCK) Where Active=1

 
	Declare @IsRegistrationOpen char(20)
	Declare @RegOpenPeriodCheck int
	Declare @TodayDate Date		
	Set @IsRegistrationOpen=@Currentsemester + '~N'

	------------------Getting the EnableScoreUpdate--------- 	
	Set @RegOpenPeriodCheck=0
	Set @TodayDate=getdate()
	Select @RegOpenPeriodCheck=Count(*) from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) Where Active=1 
	and RegistrationStatus='O' and @TodayDate between RegStartDate and RegCloseDate 
 	------------Admin ----------------------------
	IF @sUserType='I' and  @ClassAccess='A'
		 BEGIN 
			SELECT TS.[colStudentID]  As StudentID
			  ,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
			  ,TS.[colStudentEmail] As StudentEmail
			  ,TS.[colStudentSchool] As School
			  ,TS.[colStudentGrade] As Grade
			  ,TU.[coluserfName] + ' ' + TU.[coluserlName] As ParentName
			  ,TU.[coluserCity] As City
			  ,TU.[coluserPhNo] As PhoneNumber
			    ,TU.[coluserState] As SState
			  ,TU.[coluserCountry] As Country
			  ,TU.[coluserEmail] As EmailAddress
			  ,TS.[colStudentEnrolledSession] As EventSession
			  ,Class =Case			when  CM.Class='DS' Then 'Data Science' 
									when  CM.Class='AI' Then 'Artificial Intelligence' 
									when  CM.Class='GD' Then 'Game Development' 
									when  CM.Class='ED' Then 'Engineering Design'
									when  CM.Class='AD' Then 'App Development' 
									when  CM.Class='DM' Then 'Data Management' 
									when  CM.Class='ST' Then 'PSAT/SAT'
									when  CM.Class='AT' Then 'ACT' 
									when  CM.Class='JB' Then 'Junior Beginner' + ' - ' + CM.Section
									when  CM.Class='JI' Then 'Junior Intermediate' + ' - ' + CM.Section
									when  CM.Class='JA' Then 'Junior Advanced' 	+ ' - ' + CM.Section
									when  CM.Class='SB' Then 'Senior Beginner' + ' - ' + CM.Section
									when  CM.Class='SI' Then 'Senior Intermediate' + ' - ' + CM.Section
									when  CM.Class='SA' Then 'Senior Advanced'	+ ' - ' + CM.Section
								END
							  ,EventLocation =Case when  TS.[ColEventLocation]='O' Then 'On Site'  
												   when  TS.[ColEventLocation]='I' Then 'Internet' 	
												END 	
							,TU.[RegisteredDate] As RegisteredDate
							,AC.[Name] AS Chapter 
						  FROM [AMC_tblUsers] TU WITH (NOLOCK)
						  Inner Join AMC_tblStudents TS  WITH (NOLOCK)
						  on TU.coluserID=TS.colParentID
						  inner join [dbo].[AMC_ChapterMaster] AC WITH (NOLOCK)
						  on TS.ChapterID=AC.ChapterID
						  inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
						  on TS.colStudentID=CM.StudentID
		 where TS.[colStudentEnrolledSession] in (@Currentsemester,@Nextsemester)
		 and TS.[colStudentID] in 
		 					( 
		 				Select StudentID from [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
		 					inner join AMC_InstructorMaster IM  WITH (NOLOCK)
							on CM.Class=IM.Class
		 					and CM.Section=IM.Section
		 					where IM.InstructorID=@iUserID
		 					)
		  and TS.[colStatus]='R'
		  and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
		  Order by TS.[colStudentFName]
		  END 
	ELSE IF @sUserType in('I','V','C') and  @ClassAccess='N'
		 BEGIN 
			SELECT TS.[colStudentID]  As StudentID
			  ,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
			  ,TS.[colStudentEmail] As StudentEmail
			  ,TS.[colStudentSchool] As School
			  ,TS.[colStudentGrade] As Grade
			  ,TU.[coluserfName] + ' ' + TU.[coluserlName] As ParentName
			  ,TU.[coluserCity] As City
			  ,TU.[coluserPhNo] As PhoneNumber
			  	    ,TU.[coluserState] As SState
			  ,TU.[coluserCountry] As Country
			  ,TU.[coluserEmail] As EmailAddress
			  ,TS.[colStudentEnrolledSession] As EventSession
			  ,Class =Case			When  CM.Class='DS' Then 'Data Science' 
									when  CM.Class='AI' Then 'Artificial Intelligence' 
									when  CM.Class='ST' Then 'PSAT/SAT'
									when  CM.Class='AT' Then 'ACT' 
									when  CM.Class='GD' Then 'Game Development' 
									when  CM.Class='ED' Then 'Engineering Design'
									when  CM.Class='AD' Then 'App Development' 
									when  CM.Class='DM' Then 'Data Management' 
									when  CM.Class='JB' Then 'Junior Beginner' + ' - ' + CM.Section
									when  CM.Class='JI' Then 'Junior Intermediate' + ' - ' + CM.Section
									when  CM.Class='JA' Then 'Junior Advanced' 	+ ' - ' + CM.Section
									when  CM.Class='SB' Then 'Senior Beginner' + ' - ' + CM.Section
									when  CM.Class='SI' Then 'Senior Intermediate' + ' - ' + CM.Section
									when  CM.Class='SA' Then 'Senior Advanced'	+ ' - ' + CM.Section
								END
							  ,EventLocation =Case when  TS.[ColEventLocation]='O' Then 'On Site'  
												   when  TS.[ColEventLocation]='I' Then 'Internet' 	
												END 	
							,TU.[RegisteredDate] As RegisteredDate
							,AC.[Name] AS Chapter 
						  FROM [AMC_tblUsers] TU WITH (NOLOCK)
						  Inner Join AMC_tblStudents TS  WITH (NOLOCK)
						  on TU.coluserID=TS.colParentID
						  inner join [dbo].[AMC_ChapterMaster] AC WITH (NOLOCK)
						  on TS.ChapterID=AC.ChapterID
						  inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
						  on TS.colStudentID=CM.StudentID
		 where TS.[colStudentEnrolledSession]  in (@Currentsemester,@Nextsemester)
		 and TS.[colStudentID] in 
							( 
							Select StudentID from [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
							inner join AMC_InstructorMaster IM  WITH (NOLOCK)
							on CM.Class=IM.Class
							and CM.Section=IM.Section
							where IM.InstructorID=@iUserID
							)
		  and TS.[colStatus]='R'
		  and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
		  Order by TS.[colStudentFName]
		  END 
	
    ELSE IF @sUserType='S'  
	    BEGIN 
		SELECT TS.[colStudentID]  As StudentID
			  ,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
			  ,TS.[colStudentEmail] As StudentEmail
			  ,TS.[colStudentSchool] As School
			  ,TS.[colStudentGrade] As Grade
			  ,TU.[coluserfName] + ' ' + TU.[coluserlName] As ParentName
			  ,TU.[coluserCity] As City
			  ,TU.[coluserPhNo] As PhoneNumber
			  	    ,TU.[coluserState] As SState
			  ,TU.[coluserCountry] As Country
			  ,TU.[coluserEmail] As EmailAddress
			  ,TS.[colStudentEnrolledSession] As EventSession
			  ,AC.[Program] as Program 
			  ,Class =Case	 		when  CM.Class='JB' Then 'Jr Beg'  
									when  CM.Class='JI' Then 'Jr Inter'  
									when  CM.Class='JA' Then 'Jr Adv'
									when  CM.Class='SB' Then 'Sr Beg'  
									when  CM.Class='SI' Then 'Sr Inter' 
									when  CM.Class='SA' Then 'Sr Adv' 
									When  CM.Class='DS' Then 'Data Science' 
									When  CM.Class='AI' Then 'Artificial Intelligence' 
									When  CM.Class='ST' Then 'SAT' 
									When  CM.Class='AT' Then 'ACT' 
									when  CM.Class='GD' Then 'Game Development' 
									when  CM.Class='ED' Then 'Engineering Design'
									when  CM.Class='AD' Then 'App Development' 
									when  CM.Class='DM' Then 'Data Management' 
								END
							  ,EventLocation =Case when  TS.[ColEventLocation]='O' Then 'On Site'  
												   when  TS.[ColEventLocation]='I' Then 'Internet' 	
												END 	
			,TU.[RegisteredDate] As RegisteredDate
			,AC.[Name] AS Chapter
			,IsRegistrationOpen=case when @RegOpenPeriodCheck>0 and TS.colStudentEnrolledSession<>@Nextsemester then @Nextsemester + '~Not Registered'
										  else  TS.colStudentEnrolledSession + '~Registered'
									 end	
			FROM [AMC_tblUsers] TU WITH (NOLOCK)
			Inner Join AMC_tblStudents TS  WITH (NOLOCK)
			on TU.coluserID=TS.colParentID
			inner join [dbo].[AMC_ChapterMaster] AC WITH (NOLOCK)
  		    on TS.ChapterID=AC.ChapterID
			inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			on TS.colStudentID=CM.StudentID
		  where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
					  and (TS.[colStudentEnrolledSession] in (@Lastsemester,@Nextsemester))
		  and TS.[colStatus]='R'
		  --and TS.ChapterID=@ChapterID
		  Order by TS.[colStudentFName]
		  END 
	  ELSE IF (@sUserType='A'  and @Mode='D') 
	   	BEGIN
					SELECT TS.[colStudentID]  As StudentID
							  ,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
							  ,TS.[colStudentEmail] As StudentEmail
							  ,TS.[colStudentSchool] As School
							  ,TS.[colStudentGrade] As Grade
							  ,TU.[coluserfName] + ' ' + TU.[coluserlName] As ParentName
							  ,TU.[coluserCity] As City
							  ,TU.[coluserPhNo] As PhoneNumber
							  	    ,TU.[coluserState] As SState
			  ,TU.[coluserCountry] As Country
							  ,TU.[coluserEmail] As EmailAddress
							  ,TS.[colStudentEnrolledSession] As EventSession
							  ,Class =Case 	When  CM.Class='DS' Then 'Data Science'
									when  CM.Class='AI' Then 'Artificial Intelligence' 
									when  CM.Class='GD' Then 'Game Development' 
									when  CM.Class='ED' Then 'Engineering Design'
									when  CM.Class='AD' Then 'App Development' 
									when  CM.Class='DM' Then 'Data Management' 
									when  CM.Class='ST' Then 'PSAT/SAT' 
									when  CM.Class='AT' Then 'ACT' 
									when  CM.Class='JB' Then 'Junior Beginner' + ' - ' + CM.Section
									when  CM.Class='JI' Then 'Junior Intermediate' + ' - ' + CM.Section
									when  CM.Class='JA' Then 'Junior Advanced' 	+ ' - ' + CM.Section
									when  CM.Class='SB' Then 'Senior Beginner' + ' - ' + CM.Section
									when  CM.Class='SI' Then 'Senior Intermediate' + ' - ' + CM.Section
									when  CM.Class='SA' Then 'Senior Advanced'	+ ' - ' + CM.Section
								END
							  ,EventLocation =Case when  TS.[ColEventLocation]='O' Then 'On Site'  
												   when  TS.[ColEventLocation]='I' Then 'Internet' 	
												END 	
							,TU.[RegisteredDate] As RegisteredDate
							,AC.[Name] AS Chapter
						  FROM [AMC_tblUsers] TU WITH (NOLOCK)
						  Inner Join AMC_tblStudents TS  WITH (NOLOCK)
						  on TU.coluserID=TS.colParentID
						  inner join [dbo].[AMC_ChapterMaster] AC WITH (NOLOCK)
						  on TS.ChapterID=AC.ChapterID
						  inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
						  on TS.colStudentID=CM.StudentID
						 where (TS.[colStudentEnrolledSession] in (@Currentsemester,@Nextsemester))
		 			     and TS.[colStatus]='R'
						 and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
						 Order by TS.[colStudentFName]  
			END 
	 ELSE IF (@sUserType='A'  and @Mode='E') 
	   	BEGIN
					SELECT TS.[colStudentID]  As StudentID
						,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
						,TS.[colStudentSchool] As School
						,TS.[colStudentGrade] As Grade
						,TU.[coluserfName] + ' ' + TU.[coluserlName] As ParentName
						,TU.[coluserCity] As City
						,TU.[coluserPhNo] As PhoneNumber
							    ,TU.[coluserState] As SState
			  ,TU.[coluserCountry] As Country
						,TU.[coluserEmail] As EmailAddress
						,TS.[colStudentEnrolledSession] As EventSession
						,Class =Case When CM.Class='DS' Then 'Data Science' 
									when  CM.Class='AI' Then 'Artificial Intelligence' 
									when  CM.Class='GD' Then 'Game Development' 
									when  CM.Class='ED' Then 'Engineering Design'
									when  CM.Class='AD' Then 'App Development' 
									when  CM.Class='DM' Then 'Data Management' 
									when  CM.Class='ST' Then 'PSAT/SAT' 
									when  CM.Class='AT' Then 'ACT' 
									when  CM.Class='JB' Then 'Junior Beginner' + ' - ' + CM.Section
									when  CM.Class='JI' Then 'Junior Intermediate' + ' - ' + CM.Section
									when  CM.Class='JA' Then 'Junior Advanced' 	+ ' - ' + CM.Section
									when  CM.Class='SB' Then 'Senior Beginner' + ' - ' + CM.Section
									when  CM.Class='SI' Then 'Senior Intermediate' + ' - ' + CM.Section
									when  CM.Class='SA' Then 'Senior Advanced'	+ ' - ' + CM.Section
								END
						,EventLocation =Case when  TS.[ColEventLocation]='O' Then 'On Site'  
											when  TS.[ColEventLocation]='I' Then 'Internet' 	
										END 	
					,TU.[RegisteredDate] As RegisteredDate
					,AC.[Name] AS Chapter
					FROM [AMC_tblUsers] TU WITH (NOLOCK)
					Inner Join AMC_tblStudents TS  WITH (NOLOCK)
					on TU.coluserID=TS.colParentID
					inner join [dbo].[AMC_ChapterMaster] AC WITH (NOLOCK)
					on TS.ChapterID=AC.ChapterID
					inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
					on TS.colStudentID=CM.StudentID
					Where  TS.[colStatus]='R'
					and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
		 			Order by TS.[colStudentFName] 
					-- Order by TS.[RegisteredDate] Desc
			END 
      ELSE 
			BEGIN
					SELECT TS.[colStudentID]  As StudentID
							  ,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
							  ,TS.[colStudentEmail] As StudentEmail
							  ,TS.[colStudentSchool] As School
							  ,TS.[colStudentGrade] As Grade
							  ,TU.[coluserfName] + ' ' + TU.[coluserlName] As ParentName
							  ,TU.[coluserCity] As City
							  ,TU.[coluserPhNo] As PhoneNumber
							  	    ,TU.[coluserState] As SState
			  ,TU.[coluserCountry] As Country
							  ,TU.[coluserEmail] As EmailAddress
							  ,TS.[colStudentEnrolledSession] As EventSession
							  ,Class =Case When CM.Class='DS' Then 'Data Science' 
							        when  CM.Class='AI' Then 'Artificial Intelligence' 
									when  CM.Class='GD' Then 'Game Development' 
									when  CM.Class='ED' Then 'Engineering Design'
									when  CM.Class='AD' Then 'App Development' 
									when  CM.Class='DM' Then 'Data Management' 
									when  CM.Class='ST' Then 'PSAT/SAT'
									when  CM.Class='AT' Then 'ACT' 
									when  CM.Class='JB' Then 'Junior Beginner' + ' - ' + CM.Section
									when  CM.Class='JI' Then 'Junior Intermediate' + ' - ' + CM.Section
									when  CM.Class='JA' Then 'Junior Advanced' 	+ ' - ' + CM.Section
									when  CM.Class='SB' Then 'Senior Beginner' + ' - ' + CM.Section
									when  CM.Class='SI' Then 'Senior Intermediate' + ' - ' + CM.Section
									when  CM.Class='SA' Then 'Senior Advanced'	+ ' - ' + CM.Section
								END
							  ,EventLocation =Case when  TS.[ColEventLocation]='O' Then 'On Site'  
												   when  TS.[ColEventLocation]='I' Then 'Internet' 	
												END 	
							,TU.[RegisteredDate] As RegisteredDate
							,TS.[colStudentFName]+ '~#'+ TS.[colStudentLName] + '~#'+ CM.[Class] + '~#'+ TU.[coluserEmail] + '~#'+ TS.[ColEventLocation] + '~#'+ CM.[Section] +'~#'+ cast(TS.ChapterID as Char(1)) +'~#'+ TS.[colStudentEnrolledSession]  As StudentClassInfo
						    ,MM.[Password]
							,AC.[Name] AS Chapter
						  FROM [AMC_tblUsers] TU WITH (NOLOCK)
						  Inner Join AMC_tblStudents TS  WITH (NOLOCK)
						  on TU.coluserID=TS.colParentID
						  inner join [dbo].[AMC_ChapterMaster] AC WITH (NOLOCK)
						  on TS.ChapterID=AC.ChapterID
						  inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
						  on TS.colStudentID=CM.StudentID
						  inner join MemberMaster MM WITH (NOLOCK)
						  on  upper(ltrim(MM.Username))=upper(ltrim(TU.coluserEmail))
						  Where  TS.[colStatus]='R'
						 and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
						 and (TS.[colStudentEnrolledSession] in (@Currentsemester,@Nextsemester,@Lastsemester,'F2025','S2025' ))
						 Order by TS.[RegisteredDate] Desc
			END 


END