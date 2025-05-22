import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [Tag.Subscription, Tag.ShareholderInfo],
  endpoints: {
    getShareholderSubscriptions: {
      providesTags: [Tag.Subscription, Tag.ShareholderInfo],
    },
    getShareholderSubscriptionSummary: {
      providesTags: [Tag.Subscription, Tag.ShareholderInfo],
    },
    getShareholderSubscriptionDocuments: {
      providesTags: [Tag.Subscription, Tag.ShareholderInfo],
    },
    addSubscription: {
      invalidatesTags: [Tag.Subscription, Tag.ShareholderInfo],
    },
    updateSubscription: {
      invalidatesTags: [Tag.Subscription, Tag.ShareholderInfo],
    },

    attachPremiumPaymentReceipt: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        formData.append(
          "subscriptionId",
          queryArg?.body?.subscriptionId as any
        );
        return {
          url: `/api/Subscriptions/attachments/premium-payment-receipt`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },
      invalidatesTags: [Tag.Subscription, Tag.ShareholderInfo],
    },
    attachSubscriptionForm: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        formData.append(
          "subscriptionId",
          queryArg?.body?.subscriptionId as any
        );
        return {
          url: `/api/Subscriptions/attachments/subscription-form`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },
      invalidatesTags: [Tag.Subscription, Tag.ShareholderInfo],
    },
  },
});

export default enhancedApi;
