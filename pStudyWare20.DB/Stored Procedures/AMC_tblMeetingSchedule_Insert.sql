CREATE proc [dbo].[AMC_tblMeetingSchedule_Insert] 
 @RowID int
,@ChapterID int
,@Class char(2)
,@Section char(1)
,@MeetingProviderURL varchar(300)
,@MeetingURL varchar(300)
,@MeetingID varchar(30)
,@Passcode varchar(30)
,@AdminLogin varchar(100)
,@AdminPassCode varchar(30)
,@IncludeSection bit
,@MeetingDate date
,@MeetingTime time(0)
,@Active bit


AS
BEGIN
	 

	 

	IF(@RowID = 0)
			BEGIN
			INSERT INTO [dbo].[AMC_tblMeetingSchedule]
           ([ChapterID]
           ,[Class]
           ,[Section]
           ,[MeetingProviderURL]
           ,[MeetingURL]
           ,[MeetingID]
           ,[Passcode]
           ,[AdminLogin]
           ,[AdminPassCode]
           ,[IncludeSection]
           ,[Active]
           ,[InsertDate]
		   ,[MeetingDate]
		   ,[MeetingTime]
           )
     VALUES
           (@ChapterID 
           ,@Class 
           ,@Section 
           ,@MeetingProviderURL 
           ,@MeetingURL 
           ,@MeetingID 
           ,@Passcode 
           ,@AdminLogin 
           ,@AdminPassCode 
           ,@IncludeSection
           ,@Active 
           ,getdate()
		   ,@MeetingDate
		   ,@MeetingTime
           )
			END
	ELSE
			BEGIN	 
				UPDATE [dbo].[AMC_tblMeetingSchedule]
				   SET [ChapterID] = @ChapterID 
					  ,[Class] = @Class 
					  ,[Section] = @Section 
					  ,[MeetingProviderURL] = @MeetingProviderURL 
					  ,[MeetingURL] = @MeetingURL 
					  ,[MeetingID] = @MeetingID 
					  ,[Passcode] = @Passcode 
					  ,[AdminLogin] = @AdminLogin 
					  ,[AdminPassCode] = @AdminPassCode 
					  ,[IncludeSection] = @IncludeSection
					  ,[Active] = @Active					   
					  ,[UpdatedtDate] = getdate() 
					  ,[MeetingDate] = @MeetingDate
					  ,[MeetingTime] = @MeetingTime
				 WHERE  RowId= @RowID

			END


END