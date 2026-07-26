CREATE proc [dbo].[EC_spAddEnquiry]
(@Name varchar(100)
,@Email varchar(100)
,@Message varchar (8000)) 
as
BEGIN
INSERT INTO [dbo].[EC_tblEnquiry]
           ([Name]
           ,[Email]
           ,[Message]
           ,[InsertDate])

     VALUES
           (@Name
           ,@Email
           ,@Message
           ,getdate()
		   )
END