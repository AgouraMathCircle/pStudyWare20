/****** Object:  StoredProcedure [dbo].[AMC_spUpdateSemesterLookup]    Script Date: 23-Jul-20 3:52:31 PM ******/
CREATE proc [dbo].[AMC_spSelectTimeTracking] 
@Username varchar(100)= null
AS
BEGIN

	 Declare @sUserType char(1)
	 Declare @iUserID int
	 Select @sUserType=MemberType,@iUserID=pMemberID from MemberMaster with (NOLOCK) 
	 where upper(ltrim(Username))=upper(ltrim(@Username))

	 IF @sUserType='A'  
		 BEGIN 
			  SELECT  TT.LogId LogID
			 ,Row_Number() OVER(order by LogID) as mLogID
			 ,MM.FirstName + ' '+ MM.LastName AS Name
			 ,TT.TaskName   
			 ,CONVERT(VARCHAR(10), DateVolunteer, 101) As DateVolunteer
			 ,Ltrim(right(convert(varchar(25), StartTime, 100), 7)) As StartTime
			 ,Ltrim(right(convert(varchar(25), EndTime, 100), 7)) As EndTime 
			 ,Cast((DATEDIFF(MINUTE,TT.StartTime , TT.EndTime))/60 as Varchar) +':' + Cast((DATEDIFF(MINUTE,TT.StartTime , TT.EndTime))%60 as Varchar) as TotalHours
			 ,TT.CreatedDate  CreatedDate,
			 TT.TaskDescription TaskDescription
			 ,TT.Comments Comments
			 ,TT.Approved Approved
			 ,convert(varchar,[LogID]) + '~#' + [TaskName] 
			 + '~#' + CONVERT(VARCHAR(10), DateVolunteer, 101) as TimeTrackInfo
			 FROM AMC_tblTimeTracking TT WITH (NOLOCK) 
			 inner join MemberMaster MM  WITH (NOLOCK) 
			 ON TT.MemberId=MM.pMemberID
			 Where MM.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))	
			 Order by LogID desc
		 END 
	ELSE
		 BEGIN 
			  SELECT  TT.LogId LogID
			 ,Row_Number() OVER(order by LogID) as mLogID
			 ,MM.FirstName + ' '+ MM.LastName AS Name
			 ,TT.TaskName   
			 ,CONVERT(VARCHAR(10), DateVolunteer, 101) As DateVolunteer
			 ,Ltrim(right(convert(varchar(25), StartTime, 100), 7)) As StartTime
			 ,Ltrim(right(convert(varchar(25), EndTime, 100), 7)) As EndTime 
			 ,Cast((DATEDIFF(MINUTE,TT.StartTime , TT.EndTime))/60 as Varchar) +':' + Cast((DATEDIFF(MINUTE,TT.StartTime , TT.EndTime))%60 as Varchar) as TotalHours
			 ,TT.CreatedDate  CreatedDate,
			 TT.TaskDescription TaskDescription
			  ,TT.Comments Comments
			 ,TT.Approved Approved
			 ,convert(varchar,[LogID]) + '~#' + [TaskName] 
			 + '~#' + CONVERT(VARCHAR(10), DateVolunteer, 101) as TimeTrackInfo
			 FROM AMC_tblTimeTracking TT WITH (NOLOCK) 
			 inner join MemberMaster MM  WITH (NOLOCK) 
			 ON TT.MemberId=MM.pMemberID
			 and TT.MemberId=@iUserID
			 Where MM.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))	
			 Order by LogID desc
		 END 


END