-- RECOVERY: Run this first if AMC_spDocuments failed with Msg 121 (INSERT column mismatch).
-- Removes the erroneous TableDocID column added by an earlier version of the unpublish migration.

DECLARE @sql NVARCHAR(MAX) = OBJECT_DEFINITION(OBJECT_ID(N'dbo.AMC_spDocuments'));
IF @sql IS NOT NULL
BEGIN
    SET @sql = REPLACE(@sql, N'						,[TableDocID]= DM.mDocID' + CHAR(13) + CHAR(10), N'');
    SET @sql = REPLACE(@sql, N'						,[TableDocID]= DM.mDocID' + CHAR(10), N'');

    SET @sql = REPLACE(@sql, N'CREATE  proc [dbo].[AMC_spDocuments]', N'ALTER PROCEDURE [dbo].[AMC_spDocuments]');
    SET @sql = REPLACE(@sql, N'CREATE proc [dbo].[AMC_spDocuments]', N'ALTER PROCEDURE [dbo].[AMC_spDocuments]');

    EXEC sys.sp_executesql @sql;
    PRINT 'AMC_spDocuments recovery complete (removed TableDocID).';
END
ELSE
    PRINT 'AMC_spDocuments not found.';
GO
