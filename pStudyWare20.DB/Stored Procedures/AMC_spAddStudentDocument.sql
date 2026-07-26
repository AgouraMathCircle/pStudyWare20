CREATE PROCEDURE [dbo].[AMC_spAddStudentDocument]
 @StudentID int
,@DocName  varchar(100) 
,@Description varchar(100)
,@Type varchar(20)
AS
BEGIN

INSERT INTO [dbo].[AMC_tblStudentDocuments]
           (
			 [mStudentID]
			,[mDocName]
		    ,[Description]
			,[Type]
			,[InsertDate]
            )
     VALUES
           (
		     @StudentID 
		    ,@DocName 
			,@Description 
			,@Type
			,getdate()
		   )
 

END