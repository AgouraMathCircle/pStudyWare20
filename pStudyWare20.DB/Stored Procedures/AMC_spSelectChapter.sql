CREATE  proc [dbo].[AMC_spSelectChapter] 
AS
BEGIN
Select ChapterID,
	   ChapterName=Name + ' - ' + Location + ', ' + City 
from [dbo].[AMC_ChapterMaster] with (NOLOCK)
where Active=1					 
Order by ChapterDisplayOrder 
END