CREATE  proc [dbo].[AMC_spGetMessageCenter] 
@Username varchar(100)= null
,@Mode char(1)='A'
AS
BEGIN

	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @Currentsemester varchar(5)
	Declare @StartingDate DateTime
	Select @sUserType=MemberType,@iUserID=pMemberID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	Select @Currentsemester= semester,@StartingDate=Dateadd(day,-30,StartingDate) from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) Where Active=1


	IF @sUserType='S' or  @sUserType='V'
		 BEGIN
			IF @Mode='C' 
					BEGIN
						Select Count(*) Total    FROM  [dbo].[AMC_tblEmailTracking] ET WITH (NOLOCK)
						  inner join [dbo].[MemberMaster] MM WITH (NOLOCK)
						  on ET.SendFrom=MM.UserName
						  Where upper(ltrim(ET.Sendto))=upper(ltrim(@Username)) 
						  And Status<>'A'
						  AND SendDate>@StartingDate
						  AND [SendFrom]<>@Username
						  AND Status<>'R'
						  AND [Subject] not like '%You have received the new Documents%'
					 END
			ELSE
					 BEGIN
						 SELECT 
							   Row_Number() OVER(order by ID) as MessageID
							  ,ID as TrackingID
							  ,MM.[FirstName]+ ' ' + MM.[LastName] AS [SendFrom] 
							  ,[SendTo]
							  ,REPLACE(Subject, '''', '') [Subject]
							  ,[Message]
							  ,[SendBy]
							  ,[SendDate]
							  ,[Status]=Case when Status='N' then 'New'
										 When Status='R' then 'Responded'
										 When Status='V' then 'Viewed'
									END 
							 ,ID EmailID
							 ,convert(varchar(20),[ID] )+ '~#'+ [SendFrom] + '~#' + REPLACE(Subject, '''', '')  + '~#' + MM.[FirstName]+ '~#' + [SendBy] AS  Emailinfo
						  FROM  [dbo].[AMC_tblEmailTracking] ET WITH (NOLOCK)
						  inner join [dbo].[MemberMaster] MM WITH (NOLOCK)
						  on ET.SendFrom=MM.UserName
						  Where upper(ltrim(ET.Sendto))=upper(ltrim(@Username)) 
						  And Status<>'A'
						  AND SendDate>@StartingDate
						  AND [SendFrom]<>@Username
						  AND [Subject] not like '%You have received the new Documents%'
						  order by ID desc ,[Status]
					 END
			END 
	  ELSE IF @sUserType='I'
		 BEGIN
				  Declare @GroupEmail varchar(50)
				  				  
				  Select @GroupEmail=InstructorEmailGroup from AMC_ClassType AC WITH (NOLOCK) 
				  inner join AMC_InstructorMaster AI WITH (NOLOCK) 
				  on AC.Class=AI.Class
				  inner join MemberMaster MM WITH (NOLOCK) 
				  on AI.InstructorID=MM.pMemberID
				  Where MM.username=@Username
				  and MM.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))

				IF @Mode='C' 
					BEGIN
						select Count(*) Total	from AMC_tblEmailTracking  ET with (NOLOCK)
					inner Join AMC_tblStudents TS With (NOLOCK)
					on TS.colStudentID=ET.SendBy 
					inner Join [dbo].[AMC_ClassMaster] CM  With (NOLOCK)
					on CM.StudentID=TS.colStudentID
					inner Join [dbo].[AMC_InstructorMaster] IM  With (NOLOCK)
					on IM.Class=CM.Class
					and IM.Section=Cm.Section
					where Status='N' and SendDate>@StartingDate
					and [InstructorID]=@iUserID
					and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
					AND [SendFrom]<>@Username
					AND [Subject] not like '%You have received the new Documents%'
					AND ET.UserType='S'
					END
				ELSE
				  BEGIN
					 select  Row_Number() OVER(order by ID) as MessageID
					,ID as TrackingID
					,TS.colStudentFName + '' + TS.colStudentLName [SendFrom] 
					,CM.Class + ' - '+ CM.Section [SendTo]
					,REPLACE(Subject, '''', '') [Subject]
					,[Status]=Case when Status='N' then 'New'
															When Status='R' then 'Responded'
															When Status='V' then 'Viewed'
													END 
					,[Message]
					,[SendBy]
					,ID EmailID
					,SendDate
					,convert(varchar(20),[ID] )+ '~#'+ [SendFrom] + '~#' + REPLACE(Subject, '''', '')  + '~#' + TS.[colStudentFName]+ '~#' + [SendBy] AS  Emailinfo
					from AMC_tblEmailTracking  ET with (NOLOCK)
					inner Join AMC_tblStudents TS With (NOLOCK)
					on TS.colStudentID=ET.SendBy 
					inner Join [dbo].[AMC_ClassMaster] CM  With (NOLOCK)
					on CM.StudentID=TS.colStudentID
					inner Join [dbo].[AMC_InstructorMaster] IM  With (NOLOCK)
					on IM.Class=CM.Class
					and IM.Section=Cm.Section
					where Status<>'R' and SendDate>@StartingDate
					and [InstructorID]=@iUserID
					and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
					and [SendFrom]<>@Username
					and [Subject] not like '%You have received the new Documents%'
					AND ET.UserType='S'
					order by ID desc  
				END 
		 
		 END 

	 

	 ELSE  
		 BEGIN
			IF @Mode='C' 
				BEGIN
					Select Count(*) Total  FROM [dbo].[AMC_tblEmailTracking] ET WITH (NOLOCK)
				  inner Join AMC_ClassMaster CM WITH (NOLOCK)
				  on  CM.StudentID=ET.[SendBy]
				  inner Join AMC_tblStudents TS With (NOLOCK)
				  on TS.colStudentID=ET.SendBy 
				  where Status='N' AND SendDate>@StartingDate
				  and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
				  and [SendFrom]<>@Username
				  and [SendTo] like '%@agouramathcircle.org%'
				  and [Subject] not like '%You have received the new Documents%'
				  and ET.UserType='S'
		 		END
			ELSE
			  BEGIN
				 SELECT 
					   Row_Number() OVER(order by ID) as MessageID
					  ,ID as TrackingID
					  ,SendFrom = case  when TS.ColEventLocation='O' then  TS.colStudentFName + ' ' + TS.colStudentLName + ' - '+ rtrim(ET.[SendBy]) + ' (' + CM.Class + ' - OnSite)' 
										when TS.ColEventLocation='I' then  TS.colStudentFName + ' ' + TS.colStudentLName + ' - '+ rtrim(ET.[SendBy]) + ' (' + CM.Class + ' - OnLine)' 	 
								  end 					  
					  ,[SendTo]
					  ,REPLACE(Subject, '''', '') [Subject]
					  ,[Message]
					  ,[SendBy]
					  ,CONVERT(varchar, SendDate, 1) [SendDate]
					  ,[Status]=Case when Status='R' then 'Responded'
										 else 'New'
									END 
					  ,ID EmailID
					  ,convert(varchar(20),[ID] )+ '~#'+ [SendFrom] + '~#' + REPLACE(Subject, '''', '')  +  '~#' + '0' + '~#' + [SendBy] AS  Emailinfo
				  FROM [dbo].[AMC_tblEmailTracking] ET WITH (NOLOCK)
				  inner Join AMC_ClassMaster CM WITH (NOLOCK)
				  on  CM.StudentID=ET.[SendBy]
				  inner Join AMC_tblStudents TS With (NOLOCK)
				  on TS.colStudentID=ET.SendBy 
				  where Status='N' AND SendDate>@StartingDate
				  and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
				  and [SendFrom]<>@Username
				  and [SendTo] like '%@agouramathcircle.org%'
				  and [Subject] not like '%You have received the new Documents%'
				  and ET.UserType='S'
				  Order by ID Desc
			END
	 END
END