-- Course/Location options for registration forms from AMC_ChapterMaster.

SELECT
    ChapterID,
    LTRIM(RTRIM(Name)) AS Name,
    LTRIM(RTRIM(Location)) AS Location,
    LTRIM(RTRIM(City)) AS City
FROM dbo.AMC_ChapterMaster WITH (NOLOCK)
WHERE Active = 1
ORDER BY Name, Location, City;

-- Dropdown label: ChapterID - Name - Location - City
-- Email label: Name - Location
