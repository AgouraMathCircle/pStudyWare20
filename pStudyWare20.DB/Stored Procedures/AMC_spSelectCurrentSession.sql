CREATE proc [dbo].[AMC_spSelectCurrentSession] 
 @ChapterID int
AS
BEGIN
	 
Declare @ClassDate date

--IF @ChapterID in(2,3) Need to Enable only for online.

IF @ChapterID in(1,2,3)  
BEGIN 
	Set @ChapterID=2
END 


					Select  Top 1 [Session]= Case when SUBSTRING(CS.Semester,1,1)='F' then 'Fall ' + CS.Session 
								 when SUBSTRING(CS.Semester,1,1)='S' then 'Spring ' + CS.Session 
								 END
								   from [AMC_ClassSchedule] CS WITH (NOLOCK) 
					Inner JOIN AMC_tblMeetingSchedule MS WITH (NOLOCK) 
					on CS.ChapterID=MS.ChapterID
					and CS.ClassDate=MS.MeetingDate
					Where  MS.chapterID=@ChapterID 
END