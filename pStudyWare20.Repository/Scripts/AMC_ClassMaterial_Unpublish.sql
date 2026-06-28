-- Class material unpublish support.
-- If you previously got Msg 121 on AMC_spDocuments, run AMC_ClassMaterial_Unpublish_Recover.sql first.
-- 1) AMC_spPublishDocuments: @Active (1=publish, 0=unpublish)

IF OBJECT_ID(N'dbo.AMC_spPublishDocuments', N'P') IS NOT NULL
    DROP PROCEDURE dbo.AMC_spPublishDocuments;
GO

CREATE PROCEDURE [dbo].[AMC_spPublishDocuments]
(
    @DocID int = 0,
    @Active int = 1
)
AS
BEGIN
    IF @DocID > 0
    BEGIN
        UPDATE [dbo].[AMC_tblDocuments]
        SET Active = @Active
        WHERE [mDocID] = @DocID;
    END
END
GO

-- 2) AMC_spDocuments: always return real mDocID in DocumentID (do NOT add extra columns)
DECLARE @sql NVARCHAR(MAX) = OBJECT_DEFINITION(OBJECT_ID(N'dbo.AMC_spDocuments'));
IF @sql IS NOT NULL
BEGIN
    -- Remove TableDocID if a previous migration attempt added it (fixes Msg 121)
    SET @sql = REPLACE(@sql, N'						,[TableDocID]= DM.mDocID' + CHAR(13) + CHAR(10), N'');
    SET @sql = REPLACE(@sql, N'						,[TableDocID]= DM.mDocID' + CHAR(10), N'');

    DECLARE @patterns TABLE (OldFragment NVARCHAR(300), NewFragment NVARCHAR(100));
    INSERT INTO @patterns (OldFragment, NewFragment)
    VALUES
    (
        N'[DocumentID]= Case when DM.Active=0 then DM.mDocID' + CHAR(13) + CHAR(10) + N'									Else 0' + CHAR(13) + CHAR(10) + N'									END',
        N'[DocumentID]= DM.mDocID'
    ),
    (
        N'[DocumentID]= Case when DM.Active=0 then DM.mDocID' + CHAR(10) + N'									Else 0' + CHAR(10) + N'									END',
        N'[DocumentID]= DM.mDocID'
    );

    DECLARE @old NVARCHAR(300);
    DECLARE @new NVARCHAR(100);
    DECLARE pattern_cursor CURSOR LOCAL FAST_FORWARD FOR
        SELECT OldFragment, NewFragment FROM @patterns;

    OPEN pattern_cursor;
    FETCH NEXT FROM pattern_cursor INTO @old, @new;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        WHILE CHARINDEX(@old, @sql) > 0
            SET @sql = REPLACE(@sql, @old, @new);
        FETCH NEXT FROM pattern_cursor INTO @old, @new;
    END
    CLOSE pattern_cursor;
    DEALLOCATE pattern_cursor;

    SET @sql = REPLACE(@sql, N'CREATE  proc [dbo].[AMC_spDocuments]', N'ALTER PROCEDURE [dbo].[AMC_spDocuments]');
    SET @sql = REPLACE(@sql, N'CREATE proc [dbo].[AMC_spDocuments]', N'ALTER PROCEDURE [dbo].[AMC_spDocuments]');

    EXEC sys.sp_executesql @sql;
    PRINT 'AMC_spDocuments updated (DocumentID always returns mDocID).';
END
GO
