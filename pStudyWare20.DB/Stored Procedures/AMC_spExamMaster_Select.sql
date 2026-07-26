CREATE proc [dbo].[AMC_spExamMaster_Select] 
@Username varchar(100)
AS
BEGIN
	----------------------------Declare----------------------------------------
	Declare @Currentsemester varchar(5)
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @ChapterID int
	----------------------------Default Settings-------------------------------
	Select @Currentsemester= semester from [dbo].[AMC_tblLookupSemester] 
	WITH (NOLOCK) Where Active=1

	Select @sUserType=MemberType,@iUserID=pMemberID,@ChapterID=ChapterID from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))
	----------------------------Authorized Class-------------------------------
	Create table #Eligiableclass (Class Char (2))
	Insert into #Eligiableclass 
	Select Distinct Class from AMC_ClassType with (NOLOCK) 
	where  ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
	---------------------------Display the Results-------------------------------
	SELECT [RowID] as QuestionID
 		  ,[Semester]
		  ,[Class]
		  ,[ExamType]
		  ,EM.mSession    
		  ,[Question]
		  ,AnswerType=Case When [AnswerType]='M' then 'Mutiple Choice'
				When [AnswerType]='S' then 'Short Answer'
				When [AnswerType]='E' then 'Essay'
				When [AnswerType]='F' then 'Free Style'
				END 
		  ,[AnswerKey]
		  ,[AnswerDescription]
		  ,[Points]
		  ,DM.[mDocName] as QuestionPaper
		  ,[Category]
		  ,[CreatedDate]
		  ,Convert(varchar(10),RowID) + 'E$~#'+ ExamType + 'E$~#'+ AnswerType + 'E$~#'+ AnswerKey + 'E$~#'+ Category As QuestionIDInfo 
	  FROM [dbo].[AMC_ExamMaster] EM with (NOLOCK) 
	  Inner Join [dbo].[AMC_tblDocuments] DM with (NOLOCK) 
	  on DM.mBatch=EM.Class
	  and DM.mDescription=EM.ExamType
	  and DM.mSession=EM.mSession
	  and DM.mDocSession=EM.Semester
	  Where EM.Class in (Select Class from #Eligiableclass)
	  and EM.Semester=@Currentsemester
	  Order by QuestionID desc
END