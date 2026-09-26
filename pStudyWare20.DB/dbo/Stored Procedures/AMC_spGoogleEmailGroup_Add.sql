CREATE   PROCEDURE [dbo].[AMC_spGoogleEmailGroup_Add]
    @UserEmail NVARCHAR(100),       -- Student/Volunteer Email
    @GroupEmail NVARCHAR(100)       -- e.g., 'amc8_2026@agouramathcircle.org'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Object INT;
    DECLARE @Status INT;
    DECLARE @ResponseText NVARCHAR(MAX);
  
  -- Update this with your actual .NET Web API URL
    DECLARE @URL NVARCHAR(MAX) = 'https://localhost:5281/api/GoogleGroup/add-member'; 
    DECLARE @JsonBody NVARCHAR(MAX);

    -- 1. Create JSON Payload for your .NET Web API
     SET @JsonBody = '{"userEmail": "' + @UserEmail + '", "groupEmail": "' + @GroupEmail + '"}';
    -- 2. Open HTTP Request to .NET Web API
    EXEC sp_OACreate 'MSXML2.ServerXMLHTTP', @Object OUT;

    EXEC sp_OAMethod @Object, 'open', NULL, 'POST', @URL, 'false';
    EXEC sp_OAMethod @Object, 'setRequestHeader', NULL, 'Content-Type', 'application/json';
    EXEC sp_OAMethod @Object, 'send', NULL, @JsonBody;

    -- 3. Capture API Response
    EXEC sp_OAGetProperty @Object, 'status', @Status OUT;
    EXEC sp_OAGetProperty @Object, 'responseText', @ResponseText OUT;

    -- 4. Print or Log the Result
    IF @Status = 200
        BEGIN
            PRINT 'Success: ' + @ResponseText;
        END
    ELSE
        BEGIN
            PRINT 'Failed (Status ' + CAST(@Status AS NVARCHAR) + '): ' + @ResponseText;
        END

    -- Clean up memory
    EXEC sp_OADestroy @Object;
END
