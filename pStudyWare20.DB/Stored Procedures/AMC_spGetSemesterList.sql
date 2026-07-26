CREATE proc [dbo].[AMC_spGetSemesterList] 
----Author : Kalyan
----Purpose: used for Registration page and Student List
----Created Date: 6/14/2026
---Modified By------Modified Date-------Comments------------------------


------------------------------------------------------------------------
AS
BEGIN
	----------Declare variables-----------------------------------
	Declare @LastSemester varchar(5)
	Declare @CurrentSemester varchar(5)
	Declare @NextSemester   varchar(5)
	-------------Create the Temp table for Results----------------
	Create Table #SemesterList 
			(DisplayText varchar(30)
			 ,DisplayValue varchar(5)
			 ,DisplayType  char(1)
			 ,DisplayDefault int
			)
	---------Getting the date from Lookup Table--------------------
	Select 
	 @LastSemester=LastSemester
	,@CurrentSemester=Semester
	,@NextSemester=NextSemester
	From AMC_tblLookupSemester with (NOLOCK)
	-------Insert the Last Semester values--------------------------
	Insert into #SemesterList
			 (
		      DisplayText
			 ,DisplayValue 
			 ,DisplayType 
			 ,DisplayDefault
			 )
	values
	(
	case when LEFT(@LastSemester, 1)='F' THEN 'Fall Semester '
	     when LEFT(@LastSemester, 1)='S' THEN 'Spring Semester '  
		 end + CAST(CAST(SUBSTRING(@LastSemester, 2, 4) AS INT)  AS VARCHAR(4)) 
	,@LastSemester
	,'L'
	,0
	)
	-------Insert the Current Semester values--------------------------
	Insert into #SemesterList 
			(
		      DisplayText
			 ,DisplayValue 
			 ,DisplayType 
			 ,DisplayDefault
			 )
	values(
	case when LEFT(@CurrentSemester, 1)='F' THEN 'Fall Semester '
		 when LEFT(@CurrentSemester, 1)='S' THEN 'Spring Semester '  
		 end + CAST(CAST(SUBSTRING(@CurrentSemester, 2, 4) AS INT)  AS VARCHAR(4)) 
	,@CurrentSemester
	,'C'
	,1
	)
	-------Insert the Next Semester values--------------------------
	Insert into #SemesterList (
		      DisplayText
			 ,DisplayValue 
			 ,DisplayType 
			 ,DisplayDefault)
	values(
	case when LEFT(@NextSemester, 1)='F' THEN 'Fall Semester '
						   when LEFT(@NextSemester, 1)='S' THEN 'Spring Semester '  
					    end + CAST(CAST(SUBSTRING(@NextSemester, 2, 4) AS INT)  AS VARCHAR(4)) 
	,@NextSemester
	,'N'
	,0
	)
	-------Results--------------------------
	Select  
		 DisplayText
		,DisplayValue 
		,DisplayType 
		,DisplayDefault
	from #SemesterList with (nolock)
	------Cleanup---------------------------
	IF OBJECT_ID('dbo.YourTableName', 'U') IS NOT NULL
	BEGIN
		Drop table #SemesterList
	END
END