CREATE proc [dbo].[AMC_spMeetingSchedule_Select] 
 @UserName varchar(100)

AS
BEGIN
	 
	 Declare @UserType char(1)
	 Declare @ChapterID int
	 Declare @MemberId int
	 Declare @InstructorType char(1)

	 Declare @Class char(2)
	 Declare @Section char(1)

	 Select @UserType=MemberType,@ChapterID=ChapterID,@MemberId=pMemberID from MemberMaster with (NOLOCK) 
	 where upper(ltrim(Username))=upper(ltrim(@UserName))
	 
	 
	 
    IF (@UserType = 'I' or @UserType = 'V' or @UserType='C')
		BEGIN
			
			Select @Class=Class,@Section=Section,@InstructorType=[Type] from [AMC_InstructorMaster] with (NOLOCK) 
			where InstructorID=@MemberId

			IF @InstructorType='C' 
			BEGIN 
			SELECT M.RowID
								  ,M.ChapterID
								  ,M.Class
								  ,M.Section
								  ,M.MeetingProviderURL
								  ,M.MeetingURL
								  ,M.MeetingID
								  ,M.Passcode
								  ,M.AdminLogin
								  ,M.AdminPassCode				  
								  ,M.Active
								  ,M.InsertDate
								  ,M.UpdatedtDate
								  ,[ClassName] =Case	when M.Class='JB' Then 'Junior Beginner' 	
														when M.Class='JI' Then 'Junior Intermediate' 	
														when M.Class='JA' Then 'Junior Advanced' 	
														when M.Class='SB' Then 'Senior Beginner'
														when M.Class='SI' Then 'Senior Intermediate'
														when M.Class='SA' Then 'Senior Advanced'
														when M.Class='DS' then 'Data Science' 	
														When M.Class='AI' Then 'Artificial Intelligence'
														When M.Class='ED' Then 'Engineering Design'
														when M.Class='GD' Then 'Game Development' 
														when M.Class='AD' Then 'App Development' 
														when M.Class='DM' Then 'Data Management' 
														When M.Class='ST' Then 'PSAT/SAT'
														When M.Class='AT' Then 'ACT'
												END
								   ,FORMAT (M.MeetingDate, 'MM/dd/yyyy') + ' ' +FORMAT(CAST(M.MeetingTime as DateTime), 'hh:mm tt')   as MeetingDate
								  , C.Name as ChapterName
							  FROM [dbo].[AMC_tblMeetingSchedule] M  left join [AMC_ChapterMaster] C 
							  on M.[ChapterID]= C.[ChapterID]  
							  where M.Class = @Class 
							  and M.Section = @Section 
							  and M.Active = 1
							  --uncommand to display the meeting url for onsite
							 and  C.ChapterID=@ChapterID
						END
		ELSE 
			BEGIN
				SELECT M.RowID
					  ,M.ChapterID
					  ,M.Class
					  ,M.Section
					  ,M.MeetingProviderURL
					  ,M.MeetingURL 
					  ,M.MeetingID
					  ,M.Passcode
					  ,'N/A' AS AdminLogin
					  ,'N/A' AS AdminPassCode
					  ,M.Active
					  ,M.InsertDate
					  ,M.UpdatedtDate
					 ,[ClassName] =Case	when M.Class='JB' Then 'Junior Beginner' 	
														when M.Class='JI' Then 'Junior Intermediate' 	
														when M.Class='JA' Then 'Junior Advanced' 	
														when M.Class='SB' Then 'Senior Beginner'
														when M.Class='SI' Then 'Senior Intermediate'
														when M.Class='SA' Then 'Senior Advanced'
														when M.Class='DS' then 'Data Science' 	
														When M.Class='AI' Then 'Artificial Intelligence'
														When M.Class='ED' Then 'Engineering Design'
														when M.Class='GD' Then 'Game Development' 
														when M.Class='AD' Then 'App Development' 
														when M.Class='DM' Then 'Data Management' 
														When M.Class='ST' Then 'PSAT/SAT'
														When M.Class='AT' Then 'ACT'
												END
					   ,FORMAT (M.MeetingDate, 'MM/dd/yyyy') + ' ' +FORMAT(CAST(M.MeetingTime as DateTime), 'hh:mm tt')   as MeetingDate
					  , C.Name as ChapterName
				  FROM [dbo].[AMC_tblMeetingSchedule] M  left join [AMC_ChapterMaster] C 
				  on M.[ChapterID]= C.[ChapterID]  
				  where M.Class = @Class 
				  and M.Section = @Section 
				  and M.Active = 1
				  							  --uncommand to display the meeting url for onsite

				 and  C.ChapterID=@ChapterID
			END
		END 
ELSE IF (@UserType = 'S')

		BEGIN
				Declare @Currentsemester varchar(5)
				Select @Currentsemester= semester from [dbo].[AMC_tblLookupSemester] 
				WITH (NOLOCK) Where Active=1

				SELECT 		 

				TS.[colStudentID]  As StudentID
			  ,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName			  
			  ,TS.[colStudentEnrolledSession] As EventSession
			  ,CM.Class
			  ,CM.Section
			  ,ClassName =Case	 	when  CM.Class='JB' Then 'Junior Beginner' + ' - ' + CM.Section
									when  CM.Class='JI' Then 'Junior Intermediate' + ' - ' + CM.Section
									when  CM.Class='JA' Then 'Junior Advanced' 	+ ' - ' + CM.Section
									when  CM.Class='SB' Then 'Senior Beginner' + ' - ' + CM.Section
									when  CM.Class='SI' Then 'Senior Intermediate' + ' - ' + CM.Section
									when  CM.Class='SA' Then 'Senior Advanced'	+ ' - ' + CM.Section
									when  CM.Class='DS' then 'Data Science '+ ' - ' + CM.Section
									When  CM.Class='AI' Then 'Artificial Intelligence' 	+ ' - ' + CM.Section
									When  CM.Class='AD' Then 'App Development' 	+ ' - ' + CM.Section
									When  CM.Class='ED' Then 'Engineering Design' 	+ ' - ' + CM.Section
									When  CM.Class='DM' Then 'Data Management' 	+ ' - ' + CM.Section
									When  CM.Class='ST' Then 'PSAT/SAT'	+ ' - ' + CM.Section
									When  CM.Class='AT' Then 'ACT' 	+ ' - ' + CM.Section
								END
							  ,EventLocation =Case when  TS.[ColEventLocation]='O' Then 'On Site'  
												   when  TS.[ColEventLocation]='I' Then 'Internet' 	
												END 	
			,TU.[RegisteredDate] As RegisteredDate
			,AC.ChapterID
			,AC.[Name] AS Chapter into #StudentDetail
			FROM [AMC_tblUsers] TU WITH (NOLOCK)
			Inner Join AMC_tblStudents TS  WITH (NOLOCK)
			on TU.coluserID=TS.colParentID
			inner join [dbo].[AMC_ChapterMaster] AC WITH (NOLOCK)
  		    on TS.ChapterID=AC.ChapterID
			inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			on TS.colStudentID=CM.StudentID
		  where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@UserName))
					  and (TS.[colStudentEnrolledSession]  =@Currentsemester)
		  and TS.[colStatus]='R'
		    --uncommand to display the meeting url for onsite "and TS.ChapterID<>1"

		   and TS.ChapterID<>1
		  Order by TS.[colStudentFName]



		  Update #StudentDetail Set Section='A' where ChapterID in (Select ChapterID from [AMC_tblMeetingSchedule] with (NOLOCK) where IncludeSection=0)

		
		  select SD.StudentID,SD.StudentName,SD.ClassName,SD.EventSession,SD.Chapter,SD.ChapterID, M.RowID
				  ,M.ChapterID
				  ,M.Class
				  ,M.Section
				  ,M.MeetingProviderURL
				  ,M.MeetingURL
				  ,M.MeetingID
				  ,M.Passcode
				  ,M.AdminLogin
				  ,M.AdminPassCode				  
				  ,M.Active
				  ,M.InsertDate
				  ,M.UpdatedtDate				   
				  ,FORMAT (M.MeetingDate, 'MM/dd/yyyy') + ' ' +FORMAT(CAST(M.MeetingTime as DateTime), 'hh:mm tt')   as MeetingDate				  
			    from #StudentDetail SD  join [dbo].[AMC_tblMeetingSchedule] M on SD.Class = M.Class  and  SD.Section = M.Section where M.Active = 1
						 --uncommand to display the meeting url for onsite "and M.ChapterID<>1"
		    	and M.ChapterID<>1
				---- Drop the temp table
			     drop table #StudentDetail
				END 

ELSE
	BEGIN 
			select  
				   ChapterID
				  ,Class
				  ,Section
				  ,MeetingProviderURL
				  ,MeetingURL
				  ,MeetingID
				  ,Passcode
				  ,AdminLogin
				  ,AdminPassCode				  
				  ,Active
				  ,InsertDate
				  ,UpdatedtDate		
				  ,FORMAT (MeetingDate, 'MM/dd/yyyy') + ' ' +FORMAT(CAST(MeetingTime as DateTime), 'hh:mm tt')   as MeetingDate	
		    from   [dbo].[AMC_tblMeetingSchedule]  WITH (NOLOCK)
			Where ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username)) 	and  Active = 1

	END 

END