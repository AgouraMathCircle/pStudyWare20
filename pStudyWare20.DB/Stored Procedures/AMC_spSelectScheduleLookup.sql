CREATE proc [dbo].[AMC_spSelectScheduleLookup] 
@Username varchar(100)= null
,@DisplayValue char(10)='Session'
AS
BEGIN

	Declare @ChapterID int
	Select @ChapterID=ChapterID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	IF lower(@DisplayValue)='date'
		BEGIN 
		 SELECT  [Session]= Case when SUBSTRING(Semester,1,1)='F' then 'Fall - ' + Session
								 when SUBSTRING(Semester,1,1)='S' then 'Spring - ' + Session
							END
						
			  ,Convert( Varchar(10), ClassDate, 101 ) [DisplayValue]
		  FROM [dbo].[AMC_ClassSchedule] WITH (NOLOCK)
		  Where Active=1 and ChapterID=@ChapterID
		END 
	ELSE IF lower(@DisplayValue)='session'
	BEGIN 
	 SELECT  [Session]= Case when SUBSTRING(Semester,1,1)='F' then 'Fall - ' + Session
						     when SUBSTRING(Semester,1,1)='S' then 'Spring - ' + Session
						END
						
		  ,[DisplayValue]= Case when SUBSTRING(Semester,1,1)='F' then 'Fall ' + Session
						     when SUBSTRING(Semester,1,1)='S' then 'Spring ' + Session
						END 
	  FROM [dbo].[AMC_ClassSchedule] WITH (NOLOCK)
	  Where Active=1 and ChapterID=@ChapterID
	END 


END