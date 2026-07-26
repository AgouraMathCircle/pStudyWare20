CREATE PROCEDURE [dbo].[AMC_spUpdateAddEmailTracking]
    @Mode char(1)='V'
    ,@TrackingID int=0
    ,@SendTo varchar(50)=null
    AS
    BEGIN
        IF @Mode='T'
            BEGIN
                UPDATE AMC_tblEmailTracking SET Status='A' WHERE ID=@TrackingID
            END
        ELSE IF @Mode='V'
            BEGIN
                UPDATE AMC_tblEmailTracking SET Status='V'
                WHERE UPPER(LTRIM(Sendto))=UPPER(LTRIM(@SendTo)) AND Status='N'
            END
    END