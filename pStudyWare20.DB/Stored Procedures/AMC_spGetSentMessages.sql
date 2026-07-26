CREATE  proc [dbo].[AMC_spGetSentMessages] 
@Username varchar(100)

AS
BEGIN

	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @Currentsemester varchar(5)
	Declare @StartingDate DateTime
	Select @sUserType=MemberType,@iUserID=pMemberID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	Select @Currentsemester= semester,@StartingDate=Dateadd(day,-180,StartingDate) from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) Where Active=1

	IF @sUserType='S'  
		              
		BEGIN
			SELECT 
				Row_Number() OVER(order by ID) as MessageID
				,ID as TrackingID
				,TS.[colStudentFName]+ ' '+ [colStudentLName]  AS [SendFrom] 
				,CM.Class + ' - '+ CM.Section [SendTo]
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
				,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
				,  Case			    when  CM.Class='DS' then 'Data Science'
									when  CM.Class='AI' Then 'Artificial Intelligence'  
									when  CM.Class='ED' Then 'Engineering Design' 
									when  CM.Class='GT' Then 'Game Development' 
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
								END as MessageTo
			FROM  [dbo].[AMC_tblEmailTracking] ET WITH (NOLOCK)
			inner join [dbo].[MemberMaster] MM WITH (NOLOCK)
			on ET.SendFrom=MM.UserName left join AMC_tblStudents TS on [SendBy] = TS.colStudentID inner join
			[dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
						  on TS.colStudentID=CM.StudentID
			Where upper(ltrim(ET.Sendfrom))=upper(ltrim(@Username)) 		
			AND SendDate>@StartingDate			 
			AND [Subject] not like '%You have received the new Documents%'
			order by ID desc ,[Status]
		END			 
	  ELSE IF @sUserType='I'
		 BEGIN
				 
				 
				 select  Row_Number() OVER(order by ID) as MessageID
					,ID as TrackingID
					,TS.colStudentFName + '' + TS.colStudentLName [SendTo] 
					,CM.Class + ' - '+ CM.Section [SendFrom]
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
					where  
					upper(ltrim(ET.Sendfrom))=upper(ltrim(@Username))
					and [Subject] not like '%You have received the new Documents%'
					and [InstructorID]=@iUserID
					  and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
					  order by ID desc  
				END 
		ELSE 

			BEGIN 
				 SELECT 
					   Row_Number() OVER(order by ID) as MessageID
					  ,ID as TrackingID
					  ,TS.colStudentFName + '' + TS.colStudentLName + ' - '+ rtrim(ET.[SendBy]) + ' (' + CM.Class + ' - ' +  CM.Section + ')' AS SendFrom
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
				  where upper(ltrim(ET.Sendfrom))=upper(ltrim(@Username))
				  and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
				  and [Subject] not like '%You have received the new Documents%'
				  and SendDate>@StartingDate
				  Order by ID Desc 
			END
	 END