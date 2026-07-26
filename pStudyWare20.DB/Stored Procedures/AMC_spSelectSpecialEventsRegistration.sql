CREATE   proc [dbo].[AMC_spSelectSpecialEventsRegistration] 
 @mode int =0,
 @userName varchar (100)=null

AS
BEGIN
 IF @mode =1
	BEGIN
		SELECT Count(*) as TotalRegistration
		  FROM [dbo].[AMC_tblSpecialEventsRegistration] WITH (NOLOCK)
		    where InsertDate>'08/1/2022'
			-- and ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))		
	END 
 ELSE
	BEGIN
		SELECT [RequestID] as RegisterID
			  ,[FirstName] + ' ' + [LastName] as StudentName
			  ,[Email]
			  ,[Phone]
			  ,[City]
			  ,[School]
			  ,[Grade]
			  ,[EventName]
			  ,[InsertDate]
			  ,[FirstName] + '~#' + [LastName] as RegisterInfo
		  FROM [dbo].[AMC_tblSpecialEventsRegistration] WITH (NOLOCK)
		  where InsertDate>'08/1/2022'
		  and ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))		 
				  Order by [RequestID]
	 END
END