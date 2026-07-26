CREATE PROCEDURE [dbo].[pAdminAddMember]
	@mode varchar(50)='',
	@pMemberId int = 0
AS
BEGIN
	SET NOCOUNT ON;
	if (@mode='GetMembers')
	Begin			
			Select	MemberMaster.pMemberID
					,MemberMaster.FirstName
					,MemberMaster.LastName
					,MemberMaster.UserName
					,MemberMaster.EmailID
					,MemberMaster.LastActiveDate
					,MemberMaster.CreditScore
			From	MemberReference 
					Inner Join MemberMaster (NOLOCK)
						On MemberReference.fMemberID = MemberMaster.pMemberID
			Where	fMemberAdminID = @pMemberId 
	End
	IF(@mode ='GetRow')
		Begin
		Select * from MemberMaster
		where pMemberID =@pMemberID
		End
	
END