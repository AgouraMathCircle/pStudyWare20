CREATE proc [dbo].[AMC_tblMeetingSchedule_Select] 
 @RowID int
 
AS
BEGIN 

	IF(@RowID =0)
		BEGIN
				SELECT M.RowID
				  ,M.ChapterID
				  ,M.Class
				  ,M.Section
				  ,M.MeetingProviderURL
				  ,M.MeetingURL
				  ,M.MeetingID
				  ,M.Passcode
				  ,M.AdminLogin
				  ,M.AdminPassCode
				  ,M.IncludeSection
				  ,M.Active
				  ,M.InsertDate
				  ,M.UpdatedtDate
				  ,FORMAT (M.MeetingDate, 'MM/dd/yyyy') as MeetingDate
				  ,FORMAT(CAST(M.MeetingTime as DateTime), 'hh:mm tt')  as MeetingTime
				  , C.Name as ChapterName
			  FROM [dbo].[AMC_tblMeetingSchedule] M  left join [AMC_ChapterMaster] C on M.[ChapterID]= C.[ChapterID] order by RowID
		  END
	ELSE
		BEGIN

			SELECT [RowID]
				  ,[ChapterID]
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
				  ,[UpdatedtDate]
				  ,FORMAT (MeetingDate, 'MM/dd/yyyy') as MeetingDate
				  ,[MeetingTime]
			  FROM [dbo].[AMC_tblMeetingSchedule]  where RowID=@RowID
		END		
           
     
END