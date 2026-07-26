CREATE proc [dbo].[AMC_spDonors_Insert] 
 @RowID int
,@Year int
,@Semester varchar(10)
,@DonorLevel varchar(20)
,@DonorName varchar(100)
 

AS
BEGIN
	  

	IF(@RowID = 0)
			BEGIN
			INSERT INTO [dbo].[AMC_tblDonors]
           ([DonorName],[DonorLevel],[Year],[Semester],[PostedBy],[PostedDate]
           )
     VALUES
           (@DonorName,@DonorLevel,@Year,@Semester,'Admin'
           ,getdate()		 
           )
			END
	ELSE
			BEGIN	 
				UPDATE [dbo].[AMC_tblDonors]
				   SET [DonorName] = @DonorName 
					  ,[DonorLevel] = @DonorLevel 
					  ,[Year] = @Year 
					  ,[Semester] = @Semester 
					  ,[PostedBy] = 'Admin' 					   
					  ,[PostedDate] = getdate() 
					  
				 WHERE  DonorID= @RowID

			END


END