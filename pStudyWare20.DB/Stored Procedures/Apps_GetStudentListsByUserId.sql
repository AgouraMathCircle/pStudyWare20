CREATE PROC [dbo].[Apps_GetStudentListsByUserId](@userId int)
AS
BEGIN
 
	Declare @Username Varchar (100)
	Select @Username=EmailID from MemberMaster with (NOLOCK) 
	where pMemberID=@UserID

	Declare @Currentsemester varchar(5)
	Select @Currentsemester= semester from [dbo].[AMC_tblLookupSemester] 
	WITH (NOLOCK) Where Active=1

		SELECT TS.[colStudentID]  As StudentID
			  ,TS.[colStudentFName]+ ' '+ [colStudentLName] As StudentName
			  ,TS.[colStudentGrade] As Grade
			  ,Class =Case  When  CM.Class='JB' Then 'Junior Beginner' + ' - ' + CM.Section
									when  CM.Class='JI' Then 'Junior Intermediate' + ' - ' + CM.Section
									when  CM.Class='JA' Then 'Junior Advanced' 	+ ' - ' + CM.Section
									when  CM.Class='SB' Then 'Senior Beginner' + ' - ' + CM.Section
									when  CM.Class='SI' Then 'Senior Intermediate' + ' - ' + CM.Section
									when  CM.Class='SA' Then 'Senior Advanced'	+ ' - ' + CM.Section
									when  CM.Class='DS' Then 'Data Science' 
									when  CM.Class='AI' Then 'Artificial Intelligence' 
									when  CM.Class='ED' Then 'Engineering Design' 
									when  CM.Class='GD' Then 'Game Development'
									when  CM.Class='AD' Then 'App Development'
									when  CM.Class='DM' Then 'Data Management'
									when  CM.Class='ST' Then 'PSAT/SAT'	
									when  CM.Class='AT' Then 'ACT'	 
								END	
		    FROM [AMC_tblUsers] TU WITH (NOLOCK)
			Inner Join AMC_tblStudents TS  WITH (NOLOCK)
			on TU.coluserID=TS.colParentID
			inner join [dbo].[AMC_ClassMaster] CM WITH (NOLOCK)
			on TS.colStudentID=CM.StudentID
		  where upper(ltrim(TU.[coluserEmail]))=upper(ltrim(@Username))
					  and (TS.[colStudentEnrolledSession]  =@Currentsemester)
		  and TS.[colStatus]='R'
		  Order by TS.[colStudentFName]
END