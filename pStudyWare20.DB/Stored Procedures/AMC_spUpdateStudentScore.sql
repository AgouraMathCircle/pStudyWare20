CREATE proc [dbo].[AMC_spUpdateStudentScore] 
(
@ReportID int =0,
@Type varchar(100),
@TotalScore int,
@ReceivedScore float,
@Group varchar(100),
@ExamDate Date,
@Comments varchar(500) 
)
AS
BEGIN
 
	IF @ReportID >0
		BEGIN
			UPDATE [dbo].[AMC_tblReportCard]
			   SET [mType] = @Type
				  ,[mTotalPoints] = @TotalScore
				  ,[mReceivedPoints] = @ReceivedScore
				  ,[mGroup] =@Group
				  ,[mExamDate] = @ExamDate
				  ,[mComments] = @Comments
				  ,[ModifiedDate] = getdate()
			  WHERE [mReportCardID]=@ReportID
	    END 
END