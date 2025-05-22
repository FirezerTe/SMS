SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE dbo.GetShareholders
	@status varchar(50)
AS
BEGIN
	WITH RecentApprovalPeriodEnds AS (
		SELECT Id, MAX(PeriodEnd) AS PeriodEnd
		FROM Shareholders FOR SYSTEM_TIME ALL
		WHERE ApprovalStatus = 'Approved'
		GROUP BY Id
	)
	SELECT S.*
	FROM Shareholders FOR SYSTEM_TIME ALL S
		INNER JOIN RecentApprovalPeriodEnds R on S.PeriodEnd = R.PeriodEnd AND S.Id = R.Id
END
GO
