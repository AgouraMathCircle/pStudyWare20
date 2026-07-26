CREATE  proc [dbo].[AMC_spRegisterExistingUserCheck] 
@Username varchar(100)= null
AS
	BEGIN
		

		Declare @CheckCnt int
		Declare @Currentsemester varchar(5)
		Declare @Upcomingsemester varchar(5)
		Declare @RegOpenPeriodCheck  int
		Declare @today DateTime

		Declare @RegStatusJB  varchar(20)
		Declare @RegStatusJI  varchar(20)
		Declare @RegStatusJA  varchar(20)
		Declare @RegStatusSB  varchar(20)
		Declare @RegStatusSI  varchar(20)
		Declare @RegStatusSA  varchar(20)

		Declare @RegStatusJB2  varchar(20)
		Declare @RegStatusJI2  varchar(20)
		Declare @RegStatusJA2  varchar(20)
		Declare @RegStatusSB2  varchar(20)
		Declare @RegStatusSI2  varchar(20)
		Declare @RegStatusSA2  varchar(20)

		Declare @RegStatusDS  varchar(20)
		Declare @RegStatusAI  varchar(20)
		Declare @RegStatusAT  varchar(20)
		Declare @RegStatusST  varchar(20)


		Declare @JBTotalSpace int
		Declare @JITotalSpace int
		Declare @JATotalSpace int
		Declare @SBTotalSpace int
		Declare @SITotalSpace int
		Declare @SATotalSpace int

		Declare @JBTotalSpace2 int
		Declare @JITotalSpace2 int
		Declare @JATotalSpace2 int
		Declare @SBTotalSpace2 int
		Declare @SITotalSpace2 int
		Declare @SATotalSpace2 int

		Declare @JBOpenSpace2 int
		Declare @JIOpenSpace2 int
		Declare @JAOpenSpace2 int
		Declare @SBOpenSpace2 int
		Declare @SIOpenSpace2 int
		Declare @SAOpenSpace2 int


		Declare @DSTotalSpace int
		Declare @AITotalSpace int
		Declare @ATTotalSpace int
		Declare @STTotalSpace int

		Declare @JBOpenSpace int
		Declare @JIOpenSpace int
		Declare @JAOpenSpace int
		Declare @SBOpenSpace int
		Declare @SIOpenSpace int
		Declare @SAOpenSpace int
		Declare @DSopenSpace int
		Declare @AIOpenSpace int
		Declare @ATOpenSpace int
		Declare @STOpenSpace int
		

		Declare @ChapterID int

		Set @JBOpenSpace  =0
		Set @JIOpenSpace  =0
		Set @JAOpenSpace  =0
		Set @SBOpenSpace  =0
		Set @SIOpenSpace  =0
		Set @SAOpenSpace  =0
	
		Set @JBOpenSpace2  =0
		Set @JIOpenSpace2  =0
		Set @JAOpenSpace2  =0
		Set @SBOpenSpace2  =0
		Set @SIOpenSpace2  =0
		Set @SAOpenSpace2  =0

		set @DSTotalSpace =0
		set @AIOpenSpace  =0
		set @ATOpenSpace  =0
		set @STOpenSpace  =0

		Set @RegStatusJB ='Open'
		Set @RegStatusJI ='Open'
		Set @RegStatusJA ='Open'
		Set @RegStatusSB ='Open'
		Set @RegStatusSI ='Open'
		Set @RegStatusSA ='Open'

		Set @RegStatusJB2 ='Open'
		Set @RegStatusJI2 ='Open'
		Set @RegStatusJA2 ='Open'
		Set @RegStatusSB2 ='Open'
		Set @RegStatusSI2 ='Open'
		Set @RegStatusSA2 ='Open'

		Set @RegStatusDS ='Open'
		Set @RegStatusAI ='Open'
		Set @RegStatusST ='Open'
		Set @RegStatusAT ='Open'
	
		
		SET @JBTotalSpace2=60
		SET @JITotalSpace2=60
		SET @JATotalSpace2=60
		SET @SBTotalSpace2=75
		SET @SITotalSpace2=100
		SET @SATotalSpace2=60

		
		Set @today=dbo.Fn_Dateonly(getdate())


		Select @RegOpenPeriodCheck=Count(*) from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) Where Active=1 
		and RegistrationStatus='O'  
		and @today between RegStartDate and RegCloseDate 

				Select @Currentsemester=LastSemester
					  ,@Upcomingsemester= semester 
					  ,@JBTotalSpace=JBTotalSpace
					  ,@JITotalSpace=JITotalSpace
					  ,@JATotalSpace=JATotalSpace
					  ,@SBTotalSpace=SBTotalSpace
					  ,@SITotalSpace=SITotalSpace
					  ,@SATotalSpace=SATotalSpace
					  ,@DSTotalSpace=DSTotalSpace
					  ,@AITotalSpace=AITotalSpace
					  ,@ATTotalSpace=ATTotalSpace
					  ,@STTotalSpace=STTotalSpace
				from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) 
				Where Active=1

		Create table #RegSummary(ChapterID int,Class Char(2),Total int,ClassStatus varchar(20))

		Insert into #RegSummary 
		Select TS.ChapterID,CM.Class,Count(*),'Open' from AMC_tblStudents TS WITH (NOLOCK) 
		inner join AMC_ClassMaster CM WITH (NOLOCK) 
		on TS.colStudentID=CM.StudentID
		and CM.Semester=Substring(TS.colStudentEnrolledSession,1,1) + Substring(TS.colStudentEnrolledSession,4,2)
		Where colStudentEnrolledSession=@Upcomingsemester
		and  colStatus='R'
		and ChapterID in (1,2,3,5)
		group by  TS.ChapterID,CM.Class
		order by TS.ChapterID,CM.Class



			
		Update #RegSummary Set ClassStatus= Case when Total>=@JBTotalSpace and ChapterID=1 and Class='JB' then 'Full - Closed'
												 when Total>=@JITotalSpace and ChapterID=1 and Class='JI' then 'Full - Closed'
												 when Total>=@JATotalSpace and ChapterID=1 and Class='JA' then 'Full - Closed'
												 when Total>=@SBTotalSpace and ChapterID=1 and Class='SB' then 'Full - Closed'
												 when Total>=@SITotalSpace and ChapterID=1 and Class='SI' then 'Full - Closed'
												 when Total>=@SATotalSpace and ChapterID=1 and Class='SA' then 'Full - Closed'
												 when Total>=60 and ChapterID=2 and Class='JB' then 'Full - Closed'
												 when Total>=60 and ChapterID=2 and Class='JI' then 'Full - Closed'
												 when Total>=60 and ChapterID=2 and Class='JA' then 'Full - Closed'
												 when Total>=80 and ChapterID=2 and Class='SB' then 'Full - Closed'
												 when Total>=60 and ChapterID=2 and Class='SI' then 'Full - Closed'
												 when Total>=60 and ChapterID=2 and Class='SA' then 'Full - Closed'
												 when Total>=@DSTotalSpace and ChapterID=3 and Class='DS' then 'Full - Closed'
												 when Total>=@STTotalSpace and ChapterID=5 and Class='ST' then 'Full - Closed'
												 else 'Open'
											End 
		From #RegSummary

 
	   Select @RegStatusJB=ClassStatus,@JBOpenSpace=Total from #RegSummary WITH (NOLOCK) where  Class='JB' and ChapterID=1
		Select @RegStatusJI=ClassStatus,@JIOpenSpace=Total from #RegSummary WITH (NOLOCK) where  Class='JI' and ChapterID=1
		Select @RegStatusJA=ClassStatus,@JAOpenSpace=Total from #RegSummary WITH (NOLOCK) where  Class='JA' and ChapterID=1
		Select @RegStatusSB=ClassStatus,@SBOpenSpace=Total from #RegSummary WITH (NOLOCK) where  Class='SB' and ChapterID=1
		Select @RegStatusSI=ClassStatus,@SIOpenSpace=Total from #RegSummary WITH (NOLOCK) where  Class='SI' and ChapterID=1
		Select @RegStatusSA=ClassStatus,@SAOpenSpace=Total from #RegSummary WITH (NOLOCK) where  Class='SA' and ChapterID=1

		Select @RegStatusJB2=ClassStatus,@JBOpenSpace2=Total from #RegSummary WITH (NOLOCK) where  Class='JB' and ChapterID=2
		Select @RegStatusJI2=ClassStatus,@JIOpenSpace2=Total from #RegSummary WITH (NOLOCK) where  Class='JI' and ChapterID=2
		Select @RegStatusJA2=ClassStatus,@JAOpenSpace2=Total from #RegSummary WITH (NOLOCK) where  Class='JA' and ChapterID=2
		Select @RegStatusSB2=ClassStatus,@SBOpenSpace2=Total from #RegSummary WITH (NOLOCK) where  Class='SB' and ChapterID=2
		Select @RegStatusSI2=ClassStatus,@SIOpenSpace2=Total from #RegSummary WITH (NOLOCK) where  Class='SI' and ChapterID=2
		Select @RegStatusSA2=ClassStatus,@SAOpenSpace2=Total from #RegSummary WITH (NOLOCK) where  Class='SA' and ChapterID=2


		Select @RegStatusDS=ClassStatus,@DSOpenSpace=Total from #RegSummary WITH (NOLOCK) where  Class='DS' and ChapterID=3
		Select @RegStatusST=ClassStatus,@STOpenSpace=Total from #RegSummary WITH (NOLOCK) where  Class='ST' and ChapterID=5
		
		SELECT TS.[colStudentID]  As StudentID
					,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
					,TS.[colStudentEmail] As StudentEmail
					,TS.[colStudentSchool] As School
					,TS.[colStudentGrade] As Grade
					,TU.[coluserfName] + ' ' + TU.[coluserlName] As ParentName
					,TU.[coluserCity] As City
					,TU.[coluserPhNo] As PhoneNumber
					,TU.[coluserEmail] As EmailAddress
					,TS.[colStudentEnrolledSession] As EventSession
					,Class =Case when  CM.Class='JB' Then 'Junior Beginner' 	+ ' - ' + CM.Section
						when  CM.Class='JI' Then 'Junior Intermediate' 	+ ' - ' + CM.Section
						when  CM.Class='JA' Then 'Junior Advanced' 	+ ' - ' + CM.Section
						when  CM.Class='SB' Then 'Senior Beginner' + ' - ' + CM.Section
						when  CM.Class='SI' Then 'Senior Intermediate' + ' - ' + CM.Section
						when  CM.Class='SA' Then 'Senior Advanced'	  + ' - ' + CM.Section	
						when  CM.Class='DS' then 'Data Science'	  + ' - ' + CM.Section
						when  CM.Class='AI' Then 'Artificial Intelligence'	  + ' - ' + CM.Section	
						when  CM.Class='ED' Then 'Engineering Design'	  + ' - ' + CM.Section	
						when  CM.Class='DM' Then 'App Development'	  + ' - ' + CM.Section	
						when  CM.Class='AD' Then 'Data Management'	  + ' - ' + CM.Section	
						when  CM.Class='ST' Then 'PSAT'	  + ' - ' + CM.Section	
						when  CM.Class='AT' Then 'ACT'	  + ' - ' + CM.Section	
					END 	
					,EventLocation =Case when  TS.[ColEventLocation]='O' Then 'On Site (Woodland Hills, CA)'  
										when  TS.[ColEventLocation]='I' Then 'Internet (Zoom Meeting)' 	
									END 
				,TU.[RegisteredDate] As RegisteredDate
				,RegStatus = Case  When TS.RegistrationPriority<>1 Then 'Waiting List'
						when  CM.Class='JB' and TS.ChapterID=1 Then @RegStatusJB
						when  CM.Class='JI' and TS.ChapterID=1 Then  @RegStatusJI
						when  CM.Class='JA' and TS.ChapterID=1 Then  @RegStatusJA
						when  CM.Class='SB' and TS.ChapterID=1 Then  @RegStatusSB
						when  CM.Class='SI' and TS.ChapterID=1 Then  @RegStatusSI
						when  CM.Class='SA' and TS.ChapterID=1 Then  @RegStatusSA
						when  CM.Class='JB' and TS.ChapterID=2 Then @RegStatusJB2
						when  CM.Class='JI' and TS.ChapterID=2 Then  @RegStatusJI2
						when  CM.Class='JA' and TS.ChapterID=2 Then  @RegStatusJA2
						when  CM.Class='SB' and TS.ChapterID=2 Then  @RegStatusSB2
						when  CM.Class='SI' and TS.ChapterID=2 Then  @RegStatusSI2
						when  CM.Class='SA' and TS.ChapterID=2 Then  @RegStatusSA2
						when  CM.Class='DS' and TS.ChapterID=3 Then  @RegStatusDS
						when  CM.Class='ST' and TS.ChapterID=5 Then  @RegStatusST
					END
				 ,OpenSpace =Case   When TS.RegistrationPriority<>1 Then 0
						when  CM.Class='JB' and TS.ChapterID=1 Then  @JBTotalSpace-@JBOpenSpace
						when  CM.Class='JI' and TS.ChapterID=1 Then  @JITotalSpace-@JIOpenSpace
						when  CM.Class='JA' and TS.ChapterID=1 Then  @JATotalSpace-@JAOpenSpace
						when  CM.Class='SB' and TS.ChapterID=1 Then  @SBTotalSpace-@SBOpenSpace
						when  CM.Class='SI' and TS.ChapterID=1 Then  @SITotalSpace-@SIOpenSpace
						when  CM.Class='SA' and TS.ChapterID=1 Then  @SATotalSpace-@SAOpenSpace
						when  CM.Class='JB' and TS.ChapterID=2 Then  @JBTotalSpace2-@JBOpenSpace2
						when  CM.Class='JI' and TS.ChapterID=2 Then  @JITotalSpace2-@JIOpenSpace2
						when  CM.Class='JA' and TS.ChapterID=2 Then  @JATotalSpace2-@JAOpenSpace2
						when  CM.Class='SB' and TS.ChapterID=2 Then  @SBTotalSpace2-@SBOpenSpace2
						when  CM.Class='SI' and TS.ChapterID=2 Then  @SITotalSpace2-@SIOpenSpace2
						when  CM.Class='SA' and TS.ChapterID=2 Then  @SATotalSpace2-@SAOpenSpace2
						when  CM.Class='DS' and TS.ChapterID=3 Then  @DSTotalSpace-@DSOpenSpace
						when  CM.Class='ST' and TS.ChapterID=5 Then  @STTotalSpace-@STOpenSpace
				END
				,TS.RegistrationPriority  RegistrationPriority
				FROM [AMC_tblUsers] TU WITH (NOLOCK)
				Inner Join AMC_tblStudents TS  WITH (NOLOCK)
				on TU.coluserID=TS.colParentID
				inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
				on TS.colStudentID=CM.StudentID
				where  TS.colStudentID not  in (
				Select StudentID from AMC_tblRegistration (NOLOCK)
				Where Semester=@Upcomingsemester
				)
				and TS.[colStudentEnrolledSession]  =@Currentsemester
				and  upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
				--and  TS. RegistrationPriority=1
				and @RegOpenPeriodCheck>0
				--and  TS.ChapterID in (1,2,3,5)
				Drop table #RegSummary
END