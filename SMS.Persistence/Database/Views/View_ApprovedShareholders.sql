ALTER TABLE [Shareholders] ALTER COLUMN PeriodStart DROP HIDDEN
ALTER TABLE [Shareholders] ALTER COLUMN PeriodEnd DROP HIDDEN
GO

CREATE VIEW [dbo].[View_ApprovedShareholders] AS WITH RecentApprovalPeriodEnds AS (
	SELECT Id,
		MAX(PeriodEnd) AS PeriodEnd
	FROM Shareholders FOR SYSTEM_TIME ALL
	WHERE ApprovalStatus = 'Approved'
	GROUP BY Id
)
SELECT S.*,
	CAST (
		CASE
			WHEN S.PeriodEnd > GETUTCDATE() THEN 1
			ELSE 0
		END AS bit
	) AS IsCurrent,
	PhotoId = (
		SELECT top 1 d.DocumentId
		FROM ShareholderDocuments d
		WHERE d.ShareholderId = S.Id
			AND d.IsDeleted = 0
			AND D.DocumentType = 'ShareholderPicture'
	)
FROM Shareholders FOR SYSTEM_TIME ALL S
	INNER JOIN RecentApprovalPeriodEnds R ON S.PeriodEnd = R.PeriodEnd
	AND S.Id = R.Id
GO