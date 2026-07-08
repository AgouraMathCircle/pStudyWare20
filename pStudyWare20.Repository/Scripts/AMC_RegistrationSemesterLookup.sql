-- Registration "Register For" dropdown from AMC_tblLookupSemester.
-- Dropdown id/value: Semester, NextSemester
-- Dropdown text: SemesterName, NextSemesterName
-- No F/S-to-Fall/Spring formatting — use DB display names as stored.

IF OBJECT_ID(N'dbo.AMC_spRegistrationSemesterLookup', N'P') IS NOT NULL
    DROP PROCEDURE dbo.AMC_spRegistrationSemesterLookup;
GO

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
GO
