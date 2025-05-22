import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [
    Tag.Shareholder,
    Tag.ShareholderInfo,
    Tag.ShareholderContacts,
    Tag.ShareholderAddresses,
    Tag.AllocationSummary,
    Tag.Transfer,
    Tag.Subscription,
    Tag.Payment,
    Tag.Dividend,
  ],
  endpoints: {
    getAllShareholders: {
      providesTags: [Tag.Shareholder, Tag.ShareholderInfo],
    },
    addNewShareholder: {
      invalidatesTags: [Tag.Shareholder],
    },
    getShareholderById: {
      providesTags: [Tag.Shareholder, Tag.ShareholderInfo],
    },
    getShareholderInfo: {
      providesTags: () => [Tag.ShareholderInfo, Tag.Shareholder],
    },
    getShareholderBlockDetail: {
      providesTags: [Tag.Shareholder, Tag.ShareholderInfo],
    },
    getShareholderChangeLog: {
      providesTags: [
        Tag.Shareholder,
        Tag.ShareholderInfo,
        Tag.ShareholderAddresses,
        Tag.ShareholderContacts,
        Tag.Transfer,
        Tag.Subscription,
        Tag.Payment,
      ],
    },
    updateShareholder: {
      invalidatesTags: (result, error, args) => [
        { type: Tag.Shareholder, id: args.id },
        Tag.Shareholder,
        Tag.ShareholderInfo,
      ],
    },
    getShareholderDocuments: {
      providesTags: () => [Tag.ShareholderInfo],
    },
    typeaheadSearch: {
      keepUnusedDataFor: 0.001,
    },
    addShareholderPhoto: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        return {
          url: `/api/Shareholders/${queryArg.id}/add-photo`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },

      invalidatesTags: (_result, _error, args) => [
        { type: Tag.Shareholder, id: args.id },
        Tag.Shareholder,
        Tag.ShareholderInfo,
      ],
    },
    uploadShareholderBlockDocument: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        return {
          url: `/api/Shareholders/block-detail/${queryArg.id}/document`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },
      invalidatesTags: [Tag.ShareholderInfo],
    },
    addShareholderSignature: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        return {
          url: `/api/Shareholders/${queryArg.id}/add-signature`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },
      invalidatesTags: (_result, _error, args) => [
        { type: Tag.Shareholder, id: args.id },
        Tag.Shareholder,
        Tag.ShareholderInfo,
      ],
    },
    uploadShareholderDocument: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        return {
          url: `/api/Shareholders/${queryArg.shareholderId}/upload-shareholder-document/${queryArg.documentType}`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },
      invalidatesTags: (_result, _error, args) => [
        { type: Tag.Shareholder, id: args.shareholderId },
        Tag.Shareholder,
        Tag.ShareholderInfo,
      ],
    },
    uploadCertificateIssueDocument: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        return {
          url: `/api/Certificate/certificate-detail/${queryArg.id}/document`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },
    },

    addFamilyMembers: {
      invalidatesTags: (_result, _error, args) => [
        { type: Tag.Shareholder, id: args.id },
        Tag.Shareholder,
      ],
    },
    removeFamilyMember: {
      invalidatesTags: (result, error, args) => [
        { type: Tag.Shareholder, id: args.id },
        Tag.Shareholder,
      ],
    },

    //shareholder contacts
    getShareholderContacts: {
      providesTags: [Tag.ShareholderContacts],
    },
    addShareholderContact: {
      invalidatesTags: () => [
        { type: Tag.ShareholderContacts },
        Tag.ShareholderContacts,
        Tag.ShareholderInfo,
      ],
    },
    updateShareholderContact: {
      invalidatesTags: () => [
        { type: Tag.ShareholderContacts },
        Tag.ShareholderContacts,
        Tag.ShareholderInfo,
      ],
    },

    // shareholder address
    getShareholderAddresses: {
      providesTags: [Tag.ShareholderAddresses],
    },
    addShareholderAddress: {
      invalidatesTags: () => [
        { type: Tag.ShareholderAddresses },
        Tag.ShareholderAddresses,
      ],
    },
    updateShareholderAddress: {
      invalidatesTags: () => [
        { type: Tag.ShareholderAddresses },
        Tag.ShareholderAddresses,
      ],
    },

    //workflow
    approveShareholder: {
      invalidatesTags: () => [
        Tag.ShareholderInfo,
        Tag.AllocationSummary,
        Tag.Transfer,
        Tag.Dividend,
      ],
    },
    submitForApproval: {
      invalidatesTags: () => [
        Tag.ShareholderInfo,
        Tag.AllocationSummary,
        Tag.Transfer,
        Tag.Dividend,
      ],
    },
    rejectShareholderApprovalRequest: {
      invalidatesTags: () => [
        Tag.ShareholderInfo,
        Tag.AllocationSummary,
        Tag.Transfer,
        Tag.Dividend,
      ],
    },

    getShareholderCountPerApprovalStatus: {
      providesTags: [Tag.Shareholder, Tag.ShareholderInfo],
    },

    addShareholderNote: {
      invalidatesTags: [Tag.Shareholder, Tag.ShareholderInfo],
    },
    getShareholderRecordVersions: {
      providesTags: [Tag.Shareholder, Tag.ShareholderInfo],
    },
    blockShareholder: {
      invalidatesTags: [Tag.Shareholder, Tag.ShareholderInfo],
    },
    unBlockShareholder: {
      invalidatesTags: [Tag.Shareholder, Tag.ShareholderInfo],
    },
    saveShareholderRepresentative: {
      invalidatesTags: [Tag.Shareholder, Tag.ShareholderInfo],
    },
  },
});

export default enhancedApi;
