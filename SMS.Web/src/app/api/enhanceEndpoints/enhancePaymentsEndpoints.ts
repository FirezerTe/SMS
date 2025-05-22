import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [Tag.Payment, Tag.Subscription, Tag.ShareholderInfo],
  endpoints: {
    getSubscriptionPayments: {
      providesTags: [Tag.Payment, Tag.Subscription, Tag.ShareholderInfo],
    },
    makePayment: {
      invalidatesTags: [Tag.Payment, Tag.Subscription, Tag.ShareholderInfo],
    },
    updatePayment: {
      invalidatesTags: [Tag.Payment, Tag.Subscription, Tag.ShareholderInfo],
    },
    addNewAdjustment: {
      invalidatesTags: [Tag.Payment, Tag.Subscription, Tag.ShareholderInfo],
    },
    updatePaymentAdjustment: {
      invalidatesTags: [Tag.Payment, Tag.Subscription, Tag.ShareholderInfo],
    },
    uploadSubscriptionPaymentReceipt: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        return {
          url: `/api/Payments/${queryArg.id}/payment-receipt`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },

      invalidatesTags: [Tag.Payment, Tag.Subscription, Tag.ShareholderInfo],
    },
  },
});

export default enhancedApi;
