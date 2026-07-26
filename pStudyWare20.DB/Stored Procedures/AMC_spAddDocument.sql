CREATE PROCEDURE [dbo].[AMC_spAddDocument]
 @mDocName  varchar(100) 
,@mDescription varchar(100)
,@mClass  varchar(2) 
,@mSession  varchar(30) 
,@mTopics varchar (100)
,@mDocType char(1) ='P'
,@mPublish int =0
,@mVideoURL Varchar(1000)
AS
BEGIN
 
 Declare @Currentsemester varchar(5) 
 Declare @CurrentDocID int

 Set @CurrentDocID=0
 Select @Currentsemester= semester from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) Where Active=1

 ----------------Insert into Document Tables ----------------------------------------
	 INSERT INTO [dbo].[AMC_tblDocuments]
           (
			 [mDocName]
		    ,[mDescription]
			,[mGrade]
			,[mTopics]
			,[mDocType]
            ,[mBatch]
            ,[mSession]
			,[mDocSession]
			,[Active]
			,[InsertDate]
		    )
     VALUES
           (
		     @mDocName 
			,@mDescription 
			,@mClass 
			,@mTopics
			,@mDocType
			,@mClass 
			,@mSession
			,@Currentsemester
			,@mPublish
			,getdate()
		   )
 
 SET @CurrentDocID=@@IDENTITY

  IF @mDocType ='P'
	 BEGIN
		INSERT INTO [dbo].[AMC_tblVideos]
			   ([mBatch]
			   ,[mTopics]
			   ,[mDescription]
			   ,[mURLName]
			   ,[mSession]
			   ,[mSemester]
			   ,[Active]
			   ,[InsertDate]
			   ,[mDocID]
			   )
			VALUES
			   (@mClass
			   ,@mTopics
			   ,@mDescription
			   ,isnull (@mVideoURL,'https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured' ) 
			   ,@mSession
			   ,@Currentsemester
			   ,1
			   ,getdate()
			   ,@CurrentDocID
			   )
	 END
 	 
END