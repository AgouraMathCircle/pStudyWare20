CREATE PROC [dbo].[AMC_spRegistrationSemesterLookup]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        LTRIM(RTRIM(semester)) AS Semester,
        LTRIM(RTRIM(SemesterName)) AS SemesterName,
        LTRIM(RTRIM(NextSemester)) AS NextSemester,
        LTRIM(RTRIM(NextSemesterName)) AS NextSemesterName
    FROM dbo.AMC_tblLookupSemester WITH (NOLOCK)
    WHERE Active = 1;
END