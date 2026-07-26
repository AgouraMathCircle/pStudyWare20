CREATE PROC [dbo].[Apps_GetChannelList]
AS
BEGIN
	SELECT
		[Link], [Image], [Title], [Description]
	FROM 
		(VALUES 
			('https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured','http://agouramathcircle.org/images/AMC_Class.jpg', 'Lecture Video', 'Lecture Video'),
			('https://www.youtube.com/watch?v=j_CUTnHSNHQ','http://agouramathcircle.org/images/youtube.jpg', 'People Make Difference', 'CBS Log Angeles News'),
			('https://www.youtube.com/watch?v=ggPqGYdPxNU','http://agouramathcircle.org/images/AMCFest2018_PranavSpeech.jpg', 'Presdient Speech', 'AMC Fest 2018')
		) a ([Link], [Image], [Title], [Description])
END