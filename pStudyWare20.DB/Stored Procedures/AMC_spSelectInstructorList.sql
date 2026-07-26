CREATE proc [dbo].[AMC_spSelectInstructorList]
@Username varchar(100)= null 
AS
BEGIN

Create table #LastLogin 
(
InstructorID int
,LastLogin Date
)


Insert into #LastLogin(InstructorID)
Select pMemberID from MemberMaster with (NOLOCK) 
where MemberType<>'S'
Order by pMemberID



Update #LastLogin set LastLogin = ij.Logindate from #LastLogin la 
inner Join 
(Select A.UserID userid,Max(Logindate) Logindate from AMC_tblUserTracking A  with (NOLOCK) 
inner Join #LastLogin B  with (NOLOCK)
on A.UserID=B.InstructorID
group by UserID) ij 
on la.InstructorID = ij.userid

SELECT [pMemberID] InstructorID
      ,[FirstName]
      ,[LastName]
      ,[UserName]
      ,[EmailID]
	  ,IM.[Contactphone] as ContactPhone
	  ,InstructorType= case  when IM.Type='P'  then 'Primary'
							 when IM.Type='S'  then 'Secondary'
							 when IM.Type='C'  then 'Coordinator'
							 when IM.Type='V'  then 'Volunteers'
							 when IM.Type='A'  then 'Administrator'
					   end
	  ,Class =case  when IM.Class='DS' Then 'Data Science'  
					when IM.Class='AI' Then 'Artificial Intelligence'  
					when IM.Class='GD' Then 'Game Development' 
					when IM.Class='AD' Then 'App Development' 
					when IM.Class='DM' Then 'Data Management' 
					when IM.Class='ST' Then 'PSAT' + ' - ' + IM.Section
					when IM.Class='AT' Then 'ACT' 
					when IM.CLASS='JB' then 'Junior Begineer' + ' - ' + IM.Section
					when IM.CLASS='JI' then 'Junior Intermediate' + ' - ' + IM.Section
					when IM.CLASS='JA' then 'Junior Advanced' + ' - ' + IM.Section
					when IM.CLASS='SB' then 'Senior Begineer' + ' - ' + IM.Section
					when IM.CLASS='SI' then 'Senior Intermediate' + ' - ' + IM.Section
					when IM.CLASS='SA' then 'Senior Advanced' + ' - ' + IM.Section

			End
	  ,CM.Name as ChapterName
	  ,mStatus=case when MM.Approved=1 then 'Active'
				   else 'Deactive'
				   end
	  ,LL.LastLogin LastLogin  				
	  ,MM.FirstName+ '~#'+ MM.LastName+  '~#'+ MM.[EmailID]+  '~#'+ IM.[ContactPhone]+ '~#'+ rtrim(IM.[Type]) + '~#'+ IM.[Class] + '~#'+ IM.[Section] + '~#'+  cast(MM.ChapterID as Char(1)) + '~#'+  cast(MM.Approved as Char(1)) As InstructorInfo
  FROM [dbo].[MemberMaster] MM  WITH (NOLOCK)
  inner Join AMC_InstructorMaster IM   WITH (NOLOCK )
  on MM.pMemberID=IM.InstructorID
  inner Join AMC_ChapterMaster CM WITH (NOLOCK)
  on CM.ChapterID=IM.ChapterID
  inner join  #LastLogin LL
  on LL.InstructorID=MM.pMemberID
  Where MM.MemberType in('I','V','C')
  and MM.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))	
  Order by FirstName



END