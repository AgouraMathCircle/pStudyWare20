CREATE PROCEDURE [dbo].[AMC_spGENERATEPASSWORD](@RandomPassword VARCHAR(10) OUTPUT)  
AS   
BEGIN  
SET NOCOUNT ON  
declare @LENGTH INT,@CharPool varchar(26),@PoolLength varchar(26),@LoopCount  INT  
DECLARE @RandomString VARCHAR(10),@CHARPOOLINT VARCHAR(9)    
    
SET @CharPool = 'A!B@1&C!D#2E@%&FG#H$IJ$3K%LM%N*4PQR%S5T&6%#@U7*$#8V(W)9X_0YZ'  
DECLARE @TMPSTR VARCHAR(3)  

SET @PoolLength = DataLength(@CharPool)  
SET @LoopCount = 0  
SET @RandomString = ''  
  
    WHILE (@LoopCount <10)  
		BEGIN  
			SET @TMPSTR =   SUBSTRING(@Charpool, CONVERT(int, RAND() * @PoolLength), 1)           
			SELECT @RandomString  = @RandomString + CONVERT(VARCHAR(5), CONVERT(INT, RAND() * 10))  
			IF(DATALENGTH(@TMPSTR) > 0)  
			BEGIN   
				SELECT @RandomString = @RandomString + @TMPSTR    
				SELECT @LoopCount = @LoopCount + 1  
		 END  
    END  
    SET @LOOPCOUNT = 0    
    SET @RandomPassword=@RandomString  
END