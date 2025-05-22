CREATE VIEW [dbo].[View_ShareholderApprovalRequests] AS
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
FROM Shareholders S
WHERE S.ApprovalStatus = 'Submitted'
GO