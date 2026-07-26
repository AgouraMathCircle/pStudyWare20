CREATE  proc [dbo].[AMC_spDocumentsRepository] 
@Username varchar(100)= null
AS
BEGIN

	-----Find the Usertype-----------------------
	Declare @sUserType char(1)
	Declare @iUserID int
	Declare @systemAdmin Char(1)
	Select @sUserType=MemberType,@iUserID=pMemberID,@systemAdmin=systemAdmin from MemberMaster with (NOLOCK) 
	where upper(ltrim(Username))=upper(ltrim(@Username))

	Declare @Currentsemester varchar(5)
	
	Select @Currentsemester= semester from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) Where Active=1

	------------Admin ----------------------------
	--IF @sUserType='I'  
	--		BEGIN 
	--			SELECT 
	--				   Row_Number() OVER(order by mdocId) as mDocID 
	--				   ,[DocumentID]= Case when Active=0 then mDocID
	--								Else 0
	--								END 
	--				  ,[mGrade]
	--				  ,[mBatch]
	--				  ,[mDocName]
	--				  ,[mTopics] [Topics]
	--				  ,[InsertDate]
	--				  ,[mSession]
	--				  ,[mDescription] [Description] 
	--				  ,[InsertDate]
	--				  ,[Class] =Case	when mBatch='JB' Then 'Junior Beginner' 	
	--									when mBatch='JI' Then 'Junior Intermediate' 	
	--									when mBatch='JA' Then 'Junior Advanced' 	
	--									when mBatch='SB' Then 'Senior Beginner'
	--									when mBatch='SI' Then 'Senior Intermediate'
	--									when mBatch='SA' Then 'Senior Advanced'	 	
	--							END
	--		  FROM [dbo].[AMC_tblDocuments] DM WITH (NOLOCK)
	--		  inner join [dbo].[AMC_InstructorMaster] IM  WITH (NOLOCK)
	--		  on DM.mBatch=IM.Class
	--		  and IM.[InstructorID]=@iUserID
	--		  and DM.mDocType='W'
	--		  and DM.Active=1
	--		  Order by DM.InsertDate Desc
	--		END 
	--	ELSE

	IF @systemAdmin='Y'
				BEGIN 
					SELECT 
						 Row_Number() OVER(order by mdocId) as mDocID 
						,[DocumentID]= Case when Active=0 then mDocID
									Else 0
									END 
						,[mDocName]
						,[mTopics] [Topics]
						,[mDescription] [Description] 
						,[mGrade]
						,[mBatch]
						,[mSession]
						,[InsertDate]
						,[Class] =Case	when mBatch='JB' Then 'Junior Beginner' 	
										when mBatch='JI' Then 'Junior Intermediate' 	
										when mBatch='JA' Then 'Junior Advanced' 	
										when mBatch='SB' Then 'Senior Beginner'
										when mBatch='SI' Then 'Senior Intermediate'
										when mBatch='SA' Then 'Senior Advanced'
										When mBatch='DS' Then 'Data Science'		 	
										When mBatch='AI' Then 'Artificial Intelligence'
										When mBatch='ED' Then 'Engineering Design'
										when mBatch='GD' Then 'Game Development' 
										when mBatch='AD' Then 'App Development' 
										when mBatch='DM' Then 'Data Management' 
										When mBatch='ST' Then 'PSAT/SAT'
										When mBatch='AT' Then 'ACT'
								END
						FROM [dbo].[AMC_tblDocuments]  WITH (NOLOCK)
						Where mDocType='W'
						Order by InsertDate Desc
				END 

END