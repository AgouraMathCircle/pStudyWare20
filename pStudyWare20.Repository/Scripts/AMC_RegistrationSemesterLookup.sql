-- Registration "Register For" dropdown: active row Semester + LastSemester from AMC_tblLookupSemester.
-- Display labels: F/S codes become Fall Semester YYYY / Spring Semester YYYY (see SemesterFormatHelper).

-- Example shape returned to API (TOP 1 Active = 1):
-- Semester     LastSemester   SemesterName
-- S2026        F2026          Spring Semester 2026

SELECT TOP 1
    LTRIM(RTRIM(semester)) AS Semester,
    LTRIM(RTRIM(LastSemester)) AS LastSemester,
    LTRIM(RTRIM(SemesterName)) AS SemesterName
FROM dbo.AMC_tblLookupSemester WITH (NOLOCK)
WHERE Active = 1;
