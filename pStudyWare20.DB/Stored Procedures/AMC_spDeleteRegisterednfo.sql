CREATE proc [dbo].[AMC_spDeleteRegisterednfo] 
@StudentID int
AS
	BEGIN
		 
		Declare @UserName Varchar(100)
		Declare @ParentID int
		Declare @StudentCount int
		
		Select @ParentID=colParentID from [AMC_tblStudents]  WITH (NOLOCK)
		where colStudentID=@StudentID
		
		Select @UserName=coluserEmail from [AMC_tblUsers] WITH (NOLOCK)
		where coluserID=@ParentID
		
		Select @StudentCount=Count(*) from [AMC_tblStudents]  WITH (NOLOCK)
		where colParentID=@ParentID

		Delete from  [AMC_ClassMaster] where studentID=@StudentID
		Delete from  [AMC_tblStudents] where colStudentID=@StudentID

		if @StudentCount=1 
		BEGIN
			Delete from  [AMC_tblUsers] where coluserEmail=@UserName
			Delete from  [MemberMaster] where UserName=@UserName
		END 

 
	END