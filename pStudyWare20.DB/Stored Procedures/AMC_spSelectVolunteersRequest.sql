CREATE  proc [dbo].[AMC_spSelectVolunteersRequest] 
  @userName varchar (100)
AS
BEGIN

  -------------Update Duplication ----------------------
  Update AMC_tblVolunteersRequest Set DuplicateID=MM.pMemberID
  From AMC_tblVolunteersRequest VR WITH (NOLOCK)
  Inner Join MemberMaster MM WITH (NOLOCK)
  ON VR.FirstName=MM.FirstName
  AND VR.LastName=MM.LastName
  Where VR.Approved =0
  AND VR.DuplicateID=0
  AND MM.MemberType in ('C','I','V')
  -------------Results----------------------------------
  SELECT [RequestID] as VolunteerID
		  ,[FirstName] + ' ' + [LastName] as VolunteerName
		  ,[Email]
		  ,[Phone]
		  ,VR.[City] as [City]
		  ,[School]
		  ,[Grade]
		  ,[EnrolledSession]  
		  ,[Location]=CH.Name
		  ,[Interest]
		  ,[Comments]
		  ,Status= Case when [Approved] =1 then 'Approved'
						when [Approved] =0 and VR.DuplicateID<>0 then 'Duplicate' + ': ' + cast(VR.DuplicateID as varchar(10)) 
						Else  'New'
				END
		  ,[InsertDate]
		  ,[FirstName] + '~#' + [LastName] + '~#' + [Email]  + '~#' + cast(VR.ChapterID as Char(1))  as VolunteerInfo
	  FROM [dbo].[AMC_tblVolunteersRequest] VR WITH (NOLOCK)
	  Inner Join [dbo].[AMC_ChapterMaster] CH  WITH (NOLOCK)
	  ON VR.ChapterID=CH.ChapterID
	  Where Approved<>1
	  and VR.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))	
	  Order by [RequestID] desc
END