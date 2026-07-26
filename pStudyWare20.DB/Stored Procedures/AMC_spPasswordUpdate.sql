CREATE proc [dbo].[AMC_spPasswordUpdate] 
@Username varchar(100),
@Password varchar(50)
AS
BEGIN

	Update [dbo].[MemberMaster]
    Set [Password]=@Password
	 where upper(ltrim([UserName]))=upper(ltrim(@Username))
	 
END