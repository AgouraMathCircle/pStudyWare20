CREATE PROCEDURE [dbo].[AMC_spNewsltr] 	@Email varchar(255)
as
if not exists ( select colLtrID from AMC_tblNewsltr
				where colEmail=@Email)
begin
	insert into AMC_tblNewsltr (colEmail) values (@Email)
end