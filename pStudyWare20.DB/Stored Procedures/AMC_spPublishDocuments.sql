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