CREATE Procedure [dbo].[AMC_spRegisterExistingUser]
    @StudentID int 
AS 
BEGIN
	Declare @ExistCnt int

		Declare @Upcomingsemester varchar(5)
		Declare @LastSemester varchar(3)
		Declare @NextSemester varchar(3)

		Select 
		 @Upcomingsemester= NextSemester
		,@NextSemester=Substring(NextSemester,1,1) + Substring(NextSemester,4,2)
		,@LastSemester=Substring(LastSemester,1,1) + Substring(LastSemester,4,2)
		from [dbo].[AMC_tblLookupSemester] WITH (NOLOCK) 
		Where Active=1

	Select @ExistCnt=Count(*) from AMC_tblRegistration WITH (NOLOCK) where StudentID=@StudentID 
	and Semester=@Upcomingsemester

		if @ExistCnt=0 
			Begin
				insert into AMC_tblRegistration
					(Semester
					,StudentID
					,InsertDate
					)
				values
					(@Upcomingsemester
					,@StudentID
					,getdate()
					)

					----------Update into Student Table--------------------
					Update [dbo].[AMC_tblStudents] 
					Set [colStudentEnrolledSession]=@Upcomingsemester
					,WaitingListStatus='N'
					,ModifiedDate=getdate()
					From [AMC_tblStudents]  Where [colStudentID]=@StudentID

					Update AMC_ClassMaster Set Semester=@NextSemester where StudentID=@StudentID and Semester=@LastSemester

					Update [AMC_tblRegistration] SET  Status='M' where  StudentID=@StudentID
			End
 
END