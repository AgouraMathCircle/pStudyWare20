CREATE proc [dbo].[AMC_spUpdateVolunteerStatus] 
(
@VolundeerID int =0,
@ChapterID int,
@Class char(2), 
@Section char(2), 
@Type char(1)
)
AS
BEGIN
 
	Declare	@firstname varchar(50)
	Declare	@lastname varchar(50)
	Declare	@emailId varchar(100) 
	Declare	@Phone varchar(20)

	IF @VolundeerID >0
		BEGIN
		   			
			 Select  
				@firstname=firstname
			   ,@lastname=lastName
			   ,@emailId=Email
			   ,@Phone=Phone
			From AMC_tblVolunteersRequest  WITH (NOLOCK)
			Where RequestID=@VolundeerID

			EXEC [dbo].[AMC_spAddInstructor]
				0,
				@firstname,
				@lastname,
				@emailId,
				@ChapterID,
				@Class, 
				@Section,
				@Phone,
				@Type

			 Update  AMC_tblVolunteersRequest Set Approved=1,ModifiedDate=getdate()
			 Where RequestID=@VolundeerID
			
	 	END
	
END