import { useMemo } from "react";
import { useGetShareholderSubscriptionDocumentsQuery } from "../../app/api";
import { DocumentType } from "../../app/api/enums";

export const useSubscriptionDocuments = (
  shareholderId?: number,
  subscriptionId?: number
) => {
  const { data: subscriptionDocuments } =
    useGetShareholderSubscriptionDocumentsQuery(
      {
        shareholderId: shareholderId || 0,
      },
      { skip: !shareholderId }
    );

  const { premiumPaymentReceipt, subscriptionForm } = useMemo(() => {
    const premiumPaymentReceipt = (subscriptionDocuments || []).find(
      (d) =>
        subscriptionId &&
        d.documentType == DocumentType.SubscriptionPremiumPaymentReceipt &&
        d.subscriptionId == subscriptionId
    );
    const subscriptionForm = (subscriptionDocuments || []).find(
      (d) =>
        subscriptionId &&
        d.documentType == DocumentType.SubscriptionForm &&
        d.subscriptionId == subscriptionId
    );

    return { premiumPaymentReceipt, subscriptionForm };
  }, [subscriptionId, subscriptionDocuments]);

  return { premiumPaymentReceipt, subscriptionForm, subscriptionDocuments };
};
