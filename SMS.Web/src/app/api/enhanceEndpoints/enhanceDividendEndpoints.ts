import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [
    Tag.Dividend,
    Tag.ShareholderInfo,
    Tag.Allocation,
    Tag.AllocationSummary,
    Tag.BankAllocation,
  ],
  endpoints: {
    getShareholderDividends: {
      providesTags: [Tag.Dividend],
    },

    submitDividendDecision: {
      invalidatesTags: [Tag.Dividend, Tag.ShareholderInfo],
    },

    //dividend setups
    getSetups: {
      providesTags: [
        Tag.Dividend,
        Tag.Allocation,
        Tag.AllocationSummary,
        Tag.BankAllocation,
      ],
    },
    getSetupDividends: {
      providesTags: [
        Tag.Dividend,
        Tag.Allocation,
        Tag.AllocationSummary,
        Tag.BankAllocation,
      ],
    },
    getShareholderDividendDetail: {
      providesTags: [
        Tag.Dividend,
        Tag.Allocation,
        Tag.AllocationSummary,
        Tag.BankAllocation,
      ],
    },
    updateDividendSetup: {
      invalidatesTags: [
        Tag.Dividend,
        Tag.Allocation,
        Tag.AllocationSummary,
        Tag.BankAllocation,
      ],
    },
    addNewDividendSetup: {
      invalidatesTags: [
        Tag.Dividend,
        Tag.Allocation,
        Tag.AllocationSummary,
        Tag.BankAllocation,
      ],
    },
    computeDividendRate: {
      invalidatesTags: [Tag.Dividend],
    },
    approveDividendSetup: {
      invalidatesTags: [
        Tag.Dividend,
        Tag.ShareholderInfo,
        Tag.Allocation,
        Tag.AllocationSummary,
        Tag.BankAllocation,
      ],
    },
    taxPendingDecisions: {
      invalidatesTags: [Tag.Dividend, Tag.ShareholderInfo],
    },
    attachDividendDecisionDocument: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body?.file as any);
        return {
          url: `/api/Dividends/decision-attachment/${queryArg.id}`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },
      invalidatesTags: [Tag.Dividend],
    },
  },
});

export default enhancedApi;
