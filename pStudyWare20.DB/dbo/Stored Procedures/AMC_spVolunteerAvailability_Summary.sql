CREATE PROCEDURE [dbo].[AMC_spVolunteerAvailability_Summary]
@Username varchar(100)= null 
AS
BEGIN
	
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @ChapterID int 
	Declare @Currentsemester varchar(5)
	Declare @Class char(2)
	
	---------------Finding the User Info--
	Select @sUserType=MemberType,@iUserID=pMemberID,@ChapterID=ChapterID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))
	-----------Finding the User Class info--
	Select @Class=Class from AMC_InstructorMaster with (NOLOCK)
	where InstructorID=@iUserID
	------------Getting Current Session ------------------
	Declare @CurrentSessionDate Date
	Declare @CurrentSession Varchar(30)
	Declare @TodayDate Date

	Set @TodayDate=Dateadd(day,-2,getdate())

 

	Select	@CurrentSessionDate=CurrentExamDate  from [AMC_tblLookupSemester] WITH (NOLOCK) 
	
	Select top 1 @CurrentSession=Session from AMC_ClassSchedule where classdate<=@CurrentSessionDate   
	and chapterID=1 and classdate<@TodayDate  Order by ClassDate desc

	IF @CurrentSession is null 
	BEGIN
	  SET @CurrentSession='Session 1'
	END 

	-- Select @CurrentSession= 'Session ' + CAST(CAST(REPLACE(Session, 'Session ', '') AS INT) + 1   AS VARCHAR(10)) from AMC_ClassSchedule where ClassDate=@CurrentSessionDate and chapterID=1
 
	Select top 1 @CurrentSession= 'Session ' + CAST(CAST(REPLACE(Session, 'Session ', '') AS INT) + 1   AS VARCHAR(10)) from AMC_ClassSchedule where classdate<=@CurrentSessionDate   
	and chapterID=1 and classdate<@TodayDate  Order by ClassDate desc


	IF  @sUserType in ('V', 'I', 'C')
		BEGIN
				SELECT [pMemberID] InstructorID
				  ,[FirstName]
				  ,[LastName]
				  ,[EmailID]
				  ,IM.[Contactphone] as ContactPhone
				  ,CM.Name as ChapterName
				  ,@CurrentSession AS [Session]
				  ,Class =case  when IM.Class='DS' Then 'Data Science'  
								when IM.Class='AI' Then 'Artificial Intelligence'  
								when IM.Class='GD' Then 'Game Development' 
								when IM.Class='AD' Then 'App Development' 
								when IM.Class='DM' Then 'Data Management' 
								when IM.Class='ED' Then 'Engineering Design' 
								when IM.Class='ST' Then 'PSAT' + ' - ' + IM.Section
								when IM.Class='AT' Then 'ACT' 
								when IM.CLASS='JB' then 'Junior Begineer' + ' - ' + IM.Section
								when IM.CLASS='JI' then 'Junior Intermediate' + ' - ' + IM.Section
								when IM.CLASS='JA' then 'Junior Advanced' + ' - ' + IM.Section
								when IM.CLASS='SB' then 'Senior Begineer' + ' - ' + IM.Section
								when IM.CLASS='SI' then 'Senior Intermediate' + ' - ' + IM.Section
								when IM.CLASS='SA' then 'Senior Advanced' + ' - ' + IM.Section

						End
				  ,InstructorType= case  when IM.Type='P'  then 'Primary Instructor'
										 when IM.Type='S'  then 'Secondary Instructor'
										 when IM.Type='C'  then 'Coordinator'
										 when IM.Type='V'  then 'Volunteers'
										 when IM.Type='A'  then 'Administrator'
								   end  	
				  ,Availability =case  when VA.Response ='Y' Then 'Yes'  
								 when VA.Response='N' Then 'No' 
								end
				  ,VA.Comments
				  ,InsertedDate AS  ResponseDate
			  FROM [dbo].[MemberMaster] MM  WITH (NOLOCK)
			  inner Join AMC_InstructorMaster IM   WITH (NOLOCK )
			  on MM.pMemberID=IM.InstructorID
			  inner join  AMC_VolunteerAvailability VA WITH (NOLOCK)
			  on IM.InstructorID=VA.UserID
			  inner Join AMC_ChapterMaster CM WITH (NOLOCK)
			  on CM.ChapterID=IM.ChapterID
			  Where VA.Semester in(Select semester from AMC_tblLookupSemester with (NOLOCK))
			  and VA.Class=@Class and VA.ChapterID=@ChapterID
			  and VA.Response ='Y'
			  and Session=@CurrentSession
			  Order by CM.Name,Class,InstructorType
		END 

	ELSE 
		BEGIN 
			 SELECT IM.InstructorID
			  ,MM.[FirstName]
			  ,MM.[LastName]
			  ,MM.[EmailID]
			  ,IM.[Contactphone] AS ContactPhone
			  ,CM.Name AS ChapterName
			  ,@CurrentSession AS [Session]
			  ,Class = CASE WHEN IM.Class = 'DS' THEN 'Data Science'  
							WHEN IM.Class = 'AI' THEN 'Artificial Intelligence'  
							WHEN IM.Class = 'GD' THEN 'Game Development' 
							WHEN IM.Class = 'AD' THEN 'App Development' 
							WHEN IM.Class = 'DM' THEN 'Data Management' 
							WHEN IM.Class = 'ED' THEN 'Engineering Design' 
							WHEN IM.Class = 'ST' THEN 'PSAT' + ' - ' + IM.Section
							WHEN IM.Class = 'AT' THEN 'ACT' 
							WHEN IM.Class = 'JB' THEN 'Junior Begineer' + ' - ' + IM.Section
							WHEN IM.Class = 'JI' THEN 'Junior Intermediate' + ' - ' + IM.Section
							WHEN IM.Class = 'JA' THEN 'Junior Advanced' + ' - ' + IM.Section
							WHEN IM.Class = 'SB' THEN 'Senior Begineer' + ' - ' + IM.Section
							WHEN IM.Class = 'SI' THEN 'Senior Intermediate' + ' - ' + IM.Section
							WHEN IM.Class = 'SA' THEN 'Senior Advanced' + ' - ' + IM.Section
					   END
			  ,InstructorType = CASE WHEN IM.Type = 'P' THEN 'Primary Instructor'
									 WHEN IM.Type = 'S' THEN 'Secondary Instructor'
									 WHEN IM.Type = 'C' THEN 'Coordinator'
									 WHEN IM.Type = 'V' THEN 'Volunteers'
									 WHEN IM.Type = 'A' THEN 'Administrator'
								END  	
			  ,[Availability] = CASE WHEN VA.Response = 'Y' THEN 'Yes'  
								   WHEN VA.Response = 'N' THEN 'No' 
								   ELSE 'Not responded'
							  END
			 
			 ,[Comments] = CASE WHEN VA.Response = 'Y' THEN  VA.Comments
								   WHEN VA.Response = 'N' THEN VA.Comments
								   ELSE 'Please ask them login and update'
							  END
			  ,VA.InsertedDate AS ResponseDate
		  FROM AMC_InstructorMaster IM WITH (NOLOCK)
		  LEFT JOIN [dbo].[MemberMaster] MM WITH (NOLOCK)
			ON IM.InstructorID = MM.pMemberID
		  LEFT JOIN AMC_VolunteerAvailability VA WITH (NOLOCK)
			ON IM.InstructorID = VA.UserID
		   AND  VA.Semester in(Select semester from AMC_tblLookupSemester with (NOLOCK))
		   AND VA.Session = @CurrentSession
		  LEFT JOIN AMC_ChapterMaster CM WITH (NOLOCK)
			ON IM.ChapterID = CM.ChapterID
		  Where MM.Active = 1
		  and  MM.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
		  ORDER BY  CM.Name,Class,InstructorType
	END 
END
