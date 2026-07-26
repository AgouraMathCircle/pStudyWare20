CREATE proc [dbo].[AMC_spGetTestimonials] 
as
begin
	select colTestUser as Name,colTestMessage as Comments,CONVERT(VARCHAR(11),colTestDate,106) as PostedDate from AMC_tblTestimonials
	order by colTestDate desc
end