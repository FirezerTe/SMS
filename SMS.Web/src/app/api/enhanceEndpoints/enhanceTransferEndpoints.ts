import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [Tag.Transfer, Tag.ShareholderInfo, Tag.Shareholder],
  endpoints: {
    getTransfersByShareholderId: {
      providesTags: [Tag.Transfer],
    },
    createNewTransfer: {
      invalidatesTags: [Tag.Transfer, Tag.ShareholderInfo, Tag.Shareholder],
    },
    savePaymentTransfers: {
      invalidatesTags: [Tag.Transfer, Tag.ShareholderInfo, Tag.Shareholder],
    },
    updateTransfer: {
      invalidatesTags: [Tag.Transfer, Tag.ShareholderInfo, Tag.Shareholder],
    },
    deleteTransfer: {
      invalidatesTags: [Tag.Transfer, Tag.ShareholderInfo, Tag.Shareholder],
    },
    uploadTransferDocument: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        return {
          url: `/api/Transfers/${queryArg.transferId}/document/${queryArg.documentType}`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },

      invalidatesTags: [Tag.Transfer],
    },
  },
});

export default enhancedApi;
