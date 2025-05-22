CREATE VIEW [dbo].[View_RejectedShareholderApprovalRequests] AS --WITH RecentRejectPeriodEnds AS (
--	SELECT Id, MAX(PeriodEnd) AS PeriodEnd
--	FROM Shareholders FOR SYSTEM_TIME ALL
--	WHERE ApprovalStatus = 'Rejected'
--	GROUP BY Id
--)
--SELECT S.*, PhotoId = (
--		select top 1 d.DocumentId 
--		from ShareholderDocuments d 
--		where d.ShareholderId = S.Id AND d.IsDeleted = 0 AND D.DocumentType = 'ShareholderPicture'
--	 )
--FROM Shareholders FOR SYSTEM_TIME ALL S
--	INNER JOIN Shareholders S1 ON S1.Id = S.Id
--	INNER JOIN RecentRejectPeriodEnds R on S.PeriodEnd = R.PeriodEnd AND S.Id = R.Id
--WHERE S1.ApprovalStatus <> 'Approved' AND S1.ApprovalStatus <> 'Submitted'
WITH RecentRejectPeriodEnds AS (
	SELECT Id,
		MAX(PeriodEnd) AS PeriodEnd
	FROM Shareholders FOR SYSTEM_TIME ALL
	WHERE ApprovalStatus = 'Rejected'
	GROUP BY Id
),
NotApprovedAfterRejection AS (
	SELECT R.*
	FROM RecentRejectPeriodEnds R
		LEFT JOIN View_ApprovedShareholders Approved ON R.Id = Approved.id
	WHERE Approved.Id IS NULL
		OR R.PeriodEnd > Approved.PeriodEnd
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
	INNER JOIN Shareholders S1 ON S1.Id = S.Id
	INNER JOIN NotApprovedAfterRejection R ON S.PeriodEnd = R.PeriodEnd
	AND S.Id = R.Id
WHERE S1.ApprovalStatus <> 'Approved'
	AND S1.ApprovalStatus <> 'Submitted'
GO