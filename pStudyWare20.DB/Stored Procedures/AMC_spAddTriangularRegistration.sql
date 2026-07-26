CREATE PROCEDURE [dbo].[AMC_spAddTriangularRegistration]
	@Name varchar(50)=null ,
	@Email varchar(100)= null,
	@State varchar(100)=null
AS
BEGIN
	INSERT INTO [dbo].[AMC_tblTriangularRegistration]
           ([Name]
           ,[Email]
           ,[Country]
           ,[InsertDate])
     VALUES
           (@Name
           ,@Email
           ,@State
           ,getdate())
END