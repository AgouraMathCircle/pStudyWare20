CREATE proc [dbo].[AMC_spSelectCurrentSession] 
 @ChapterID int
 ,@Mode CHar(1) =null
AS

BEGIN
	Declare @ClassDate date

	----Assign onLine or Onsite------------------------------------------------
	IF @ChapterID <>1  
	BEGIN 
		Set @ChapterID=2
	END 
	----Display the Results---------------------------------------------------
	IF @Mode='V' 
		BEGIN 
				Declare @CurrentSessionDate Date
				Declare @TodayDate Datetime
				Declare @CurrentSession Varchar(30)
				Declare @CurrentSemester Varchar(10)
				-------------------Assig Intial Values------------------	
				Set @TodayDate=getdate()
				Set @CurrentSession='Session 0'
			
				Select @CurrentSessionDate=CurrentExamDate,@CurrentSemester=semester  from [AMC_tblLookupSemester] WITH (NOLOCK) 

			    Select top 1 @CurrentSession=Session from AMC_ClassSchedule where classdate<=@CurrentSessionDate   
			    and chapterID=1 and classdate<@TodayDate  Order by ClassDate desc

			    Set @CurrentSession = 'Session ' + CAST(CAST(REPLACE(@CurrentSession, 'Session ', '') AS INT) + 1 AS VARCHAR(10));

			    Set @CurrentSession =Case when SUBSTRING(@CurrentSemester,1,1)='F' then 'Fall ' + @CurrentSession 
										 when SUBSTRING(@CurrentSemester,1,1)='S' then 'Spring ' + @CurrentSession
									End 
			   
			   Select @CurrentSession AS Session
 		END 

	ELSE
		BEGIN 
			Select  Top 1 [Session]= Case when SUBSTRING(CS.Semester,1,1)='F' then 'Fall ' + CS.Session 
						when SUBSTRING(CS.Semester,1,1)='S' then 'Spring ' + CS.Session 
						END
						from [AMC_ClassSchedule] CS WITH (NOLOCK) 
			Inner JOIN AMC_tblMeetingSchedule MS WITH (NOLOCK) 
			on CS.ChapterID=MS.ChapterID
			and CS.ClassDate=MS.MeetingDate
			Where  MS.chapterID=@ChapterID 
		END 

END
