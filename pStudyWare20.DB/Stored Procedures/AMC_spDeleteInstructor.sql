CREATE proc [dbo].[AMC_spDeleteInstructor] 
(
@InstructorID int =0 
)
AS
BEGIN
 
	IF @InstructorID >0
		BEGIN
	 
				Delete from [dbo].[AMC_InstructorMaster] where [InstructorID]=@InstructorID
				Delete from [dbo].[MemberMaster] where [pMemberID]=@InstructorID
 		END
	 
END