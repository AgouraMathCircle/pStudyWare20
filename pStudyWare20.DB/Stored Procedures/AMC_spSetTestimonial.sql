CREATE proc [dbo].[AMC_spSetTestimonial](@TestWriter varchar(255),@TestEmail varchar(255),@TestMessage varchar (8000)) 
as
begin
	 insert into AMC_tblTestimonials(colTestUser,colTestEmail,colTestMessage,colTestDate) 
							  values(@TestWriter,@TestEmail,@TestMessage,GETDATE());

end