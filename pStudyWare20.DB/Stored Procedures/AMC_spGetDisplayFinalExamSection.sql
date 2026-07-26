CREATE proc [dbo].[AMC_spGetDisplayFinalExamSection] 
----Author : Kalyan
----Purpose: used for Registration page and Student List
----Created Date: 6/14/2026
---Modified By------Modified Date-------Comments------------------------


------------------------------------------------------------------------
AS
BEGIN
	---------Getting the date from Lookup Table--------------------
	Select FinalExamDisplay,SemesterName,CurrentExamDate,FinalExamDisplayChapter From AMC_tblLookupSemester with (NOLOCK)
END