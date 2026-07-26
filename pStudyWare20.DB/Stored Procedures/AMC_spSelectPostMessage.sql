CREATE  proc [dbo].[AMC_spSelectPostMessage] 
@Type int =0,
@Mode char(1)='D',
@userName varchar(100)=''
AS
BEGIN

	Declare @ChapterID int 
	Declare @SystemAdmin Char(1)
	Select @ChapterID=ChapterID,@SystemAdmin=systemAdmin from MemberMaster WITH (NOLOCK)
	where upper(ltrim(Username))=upper(ltrim(@Username))

	If @SystemAdmin='Y'

	BEGIN
		SET @ChapterID=1
	END 


		IF (@Mode='D')
		BEGIN 
			SELECT 
				   [Type]
				  ,[Message]
				 FROM [dbo].[AMC_tblPostMessage] WITH (NOLOCK)
			  Where Active=1 and [Type] in (1,2,3,4) 
		  Order by [Type]
		END

		IF (@Mode='A')
		BEGIN 
			 Declare @Currentsemester varchar(5)
			 Declare @Previousemester varchar(5)
			 Select @Currentsemester= semester,@Previousemester=LastSemester 
			 from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) Where Active=1

			-----------------Create the Temp Table------------
			Create table #TempSummary(
			 RowID int IDENTITY(1,1) NOT NULL
			 ,Type int,Message nvarchar(max)
			 ,Class char(2) 
			 ,StudentOTotal int default 0
			 ,StudentOBTotal int default 0
			 ,StudentITotal int default 0
			 ,WaitingOTotal int default 0
			 ,WaitingITotal int default 0
			 ,StudentICTotal int default 0
			 )

			-----------Select Post Message ---------------------
			Insert into #TempSummary(Type,Message) 
			 SELECT 
				   [Type]
				  ,[Message]
				 FROM [dbo].[AMC_tblPostMessage]
			  Where Active=1 and [Type] in (1,2,3,4,5,6) 
			  and ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
			  Order by [Type]

			 -----------Summary for OnSite - Section A ---------------------
			 Insert into #TempSummary(Class,StudentOTotal)
			 Select Distinct Class,0 from [dbo].[AMC_ClassType] 
			 Order by Class

			 ------------------Update Onsite------------------------------------
			 Update #TempSummary set StudentOTotal=B.Total
			 From #TempSummary A
			 inner join (
			 Select CM.Class,Count(*) Total from [dbo].[AMC_tblStudents]  TS WITH (NOLOCK)
			 inner Join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			 on TS.colStudentID=CM.StudentID
			 Where TS.colStudentEnrolledSession=@Currentsemester
			 --and ColEventLocation='O'
			 and TS.[colStatus]='R'
			 --and CM.Section='A'
			 --and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
			 and TS.ChapterID=1
			 Group by CM.Class
			 ) B
			 on A.Class=B.Class

			
			 ----------Summary for OnLine ------------------------
			 Update #TempSummary set StudentOTotal=B.Total
			 From #TempSummary A
			 inner join (
			 Select CM.Class Class,Count(*) Total from [dbo].[AMC_tblStudents]  TS WITH (NOLOCK)
			 inner Join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			 on TS.colStudentID=CM.StudentID
			 Where TS.colStudentEnrolledSession=@Currentsemester
			 --and ColEventLocation='I'
			 and TS.[colStatus]='R'
			 --and CM.Section='A'
			 and CM.Class='DS'
			 and TS.ChapterID=3
			 Group by CM.Class) B
			 on A.Class=B.Class
			 and A.Class='DS'
			 
			 
			 
			 Update #TempSummary set StudentOTotal=B.Total
			 From #TempSummary A
			 inner join (
			 Select CM.Class Class,Count(*) Total from [dbo].[AMC_tblStudents]  TS WITH (NOLOCK)
			 inner Join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			 on TS.colStudentID=CM.StudentID
			 Where TS.colStudentEnrolledSession=@Currentsemester
			 and ColEventLocation='I'
			 and TS.[colStatus]='R'
			 --and CM.Section='A'
			 and CM.Class='AI'
			 and TS.ChapterID=4
			 Group by CM.Class) B
			 on A.Class=B.Class
			 and A.Class='AI'
			 
			 Update #TempSummary set StudentOTotal=B.Total
			 From #TempSummary A
			 inner join (
			 Select CM.Class Class,Count(*) Total from [dbo].[AMC_tblStudents]  TS WITH (NOLOCK)
			 inner Join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			 on TS.colStudentID=CM.StudentID
			 Where TS.colStudentEnrolledSession=@Currentsemester
			 and ColEventLocation='I'
			 and TS.[colStatus]='R'
			-- and CM.Section='A'
			 and CM.Class='ED'
			 and TS.ChapterID=6
			 Group by CM.Class) B
			 on A.Class=B.Class
			 and A.Class='ED'
			 


			 Update #TempSummary set StudentOTotal=B.Total
			 From #TempSummary A
			 inner join (
			 Select CM.Class Class,Count(*) Total from [dbo].[AMC_tblStudents]  TS WITH (NOLOCK)
			 inner Join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			 on TS.colStudentID=CM.StudentID
			 Where TS.colStudentEnrolledSession=@Currentsemester
			 and ColEventLocation='I'
			 and TS.[colStatus]='R'
			 and CM.Class='AT'
			 and TS.ChapterID=7
			 Group by CM.Class) B
			 on A.Class=B.Class
			 and A.Class='AT'


			 Update #TempSummary set StudentOTotal=B.Total
			 From #TempSummary A
			 inner join (
			 Select CM.Class Class,Count(*) Total from [dbo].[AMC_tblStudents]  TS WITH (NOLOCK)
			 inner Join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			 on TS.colStudentID=CM.StudentID
			 Where TS.colStudentEnrolledSession=@Currentsemester
			 --and ColEventLocation='I'
			 and TS.[colStatus]='R'
			 --and CM.Section='A'
			 and CM.Class='ST'
			 and TS.ChapterID=5
			 Group by CM.Class) B
			 on A.Class=B.Class
			 and A.Class='ST'
			 
			 			 
			 Update #TempSummary set StudentITotal=B.Total
			 From #TempSummary A
			 inner join (
			 Select CM.Class Class,Count(*) Total from [dbo].[AMC_tblStudents]  TS WITH (NOLOCK)
			 inner Join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			 on TS.colStudentID=CM.StudentID
			 Where TS.colStudentEnrolledSession=@Currentsemester
			 --and ColEventLocation='I'
			 and TS.[colStatus]='R'
			 and TS.ChapterID=2
			 Group by CM.Class) B
			 on A.Class=B.Class

			 Update #TempSummary set WaitingOTotal=B.Total
			 From #TempSummary A
			 inner join (
			 Select CM.Class Class,Count(*) Total from [dbo].[AMC_tblStudents]  TS WITH (NOLOCK)
			 inner Join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			 on TS.colStudentID=CM.StudentID
			 Where ColEventLocation='I'
			 and TS.[colStatus]='W'
			 and TS.colStudentEnrolledSession in (@Currentsemester,@Previousemester)
			 and TS.ChapterID in (Select ChapterID from dbo.GettingAuthorizedChapter(@Username))
			 Group by CM.Class) B
			 on A.Class=B.Class
			 

			 Update #TempSummary set WaitingITotal=B.Total
			 From #TempSummary A
			 inner join (
			 Select CM.Class Class,Count(*) Total from [dbo].[AMC_tblStudents]  TS WITH (NOLOCK)
			 inner Join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			 on TS.colStudentID=CM.StudentID
			 Where TS.colStudentEnrolledSession=@Currentsemester
			 and ColEventLocation='O'
			  and TS.[colStatus]='W'
			 and TS.ChapterID in 
			 (Select ChapterID from dbo.GettingAuthorizedChapter(@Username)
			 )
			 Group by CM.Class) B
			 on A.Class=B.Class



			 --------Result -----------------------
			 Declare @GDTotal Int 
			 --Select  @GDTotal= StudentOTotal from #TempSummary where Class='GD'

			-- Update #TempSummary Set StudentOTotal=@GDTotal  where Class='AI'

			 --Delete from #TempSummary  where Class='GD'
			 
			 Select * from  #TempSummary order by RowID
				
			 -------Drop temp table----------------
			 Drop table #TempSummary
		END 

	 
END