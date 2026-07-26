CREATE PROC [dbo].[Apps_GetStudentDocumentsById](@studentId int)
AS
BEGIN
	
  	Declare @Currentsemester varchar(5)
	Declare @DocID int
	Select @Currentsemester= semester,@DocID=DisplayDocumentsFrom from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) 
	Where Active=1

 SELECT 
	 	 [mDocName] AS [Link]
		,TV.[mURLName] AS [Video]
		,[Class] =Case	when TD.mBatch='JB' Then 'Junior Beginner' 	
						when TD.mBatch='JI' Then 'Junior Intermediate' 	
						when TD.mBatch='JA' Then 'Junior Advanced' 	
						when TD.mBatch='SB' Then 'Senior Beginner'
						when TD.mBatch='SI' Then 'Senior Intermediate'
						when TD.mBatch='SA' Then 'Senior Advanced'	 	
						When TD.mBatch='DS' Then 'Data Science'		 	
						When TD.mBatch='AI' Then 'Artificial Intelligence'
						When TD.mBatch='ED' Then 'Engineering Design'
						when TD.mBatch='GD' Then 'Game Development' 
						when TD.mBatch='AD' Then 'App Development' 
						when TD.mBatch='DM' Then 'Data Management' 
						When TD.mBatch='ST' Then 'PSAT/SAT'
						When TD.mBatch='AT' Then 'ACT'
					END
		,TD.[mTopics] AS [Topics]
		,TD.[mDescription] AS [Description] 
		,TD.[mSession] AS [Session]
		,Convert( Varchar(10),TD.InsertDate, 101 ) AS [PostedDate]
		,CAST(Day(TD.InsertDate) AS VARCHAR(2))AS [PostedDay]
		,CAST(TD.InsertDate AS CHAR(3)) AS  [PostedMonth]
		,CAST(Year(TD.InsertDate) AS VARCHAR(4)) AS  [PostedYear]
		FROM [dbo].[AMC_tblDocuments] TD WITH (NOLOCK)
						Inner Join [dbo].[AMC_tblVideos] TV WITH (NOLOCK)
						on TD.[mDocID]=TV.[mDocID]
	where TD.mBatch in
	(
		select  Class 
		FROM [AMC_ClassMaster] CM WITH (NOLOCK)
		Inner Join AMC_tblStudents TS  WITH (NOLOCK)
		on CM.StudentID=TS.colStudentID
		inner join AMC_tblUsers TU
		on TU.coluserID=TS.colParentID
		and TS.colStatus='R'
		where TS.colStudentID=@StudentId
		and TS.colStudentEnrolledSession=@Currentsemester
		)
		and TD.Active=1
		and TD.mDocType='P'
		and TD.mDocID>@DocID
		and mDocSession=@Currentsemester 
		Order by TD.[mDocID] Desc


		 

 END