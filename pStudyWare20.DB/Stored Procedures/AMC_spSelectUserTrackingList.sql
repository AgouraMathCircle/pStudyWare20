CREATE proc [dbo].[AMC_spSelectUserTrackingList] 
@UserName varchar(100)
AS
BEGIN
    

	select 
	RowID,
	MM.FirstName FirstName,
	MM.LastName as Lastname,
	MM.[EmailID] as UserName,
	UserType=Case when UT.UserType='A' then 'Administor'
		 When UT.UserType='I' then 'Instructor'
		 When UT.UserType='S' then 'Student'
		 When UT.UserType='V' then 'Volunteer'
		 ELSE UT.UserType 
	End ,
	UT.[LoginDate] Logindate
	,IPAddress LoginBy
	from [dbo].[AMC_tblUserTracking] UT WITH (NOLOCK) 
	inner join [dbo].[MemberMaster] MM WITH (NOLOCK)
	on UT.UserName=MM.[UserName]
	Where UT.[LoginDate]>dateadd(day, -1, getdate())
	and  MM.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))	
	order by RowID desc
End