import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [Tag.Allocation, Tag.AllocationSummary, Tag.BankAllocation],
  endpoints: {
    getAllAllocations: {
      providesTags: [Tag.Allocation],
    },
    getAllocationSummaries: {
      providesTags: [Tag.AllocationSummary, Tag.AllocationSummary],
    },
    getAllShareholderAllocations: {
      providesTags: [Tag.AllocationSummary, Tag.AllocationSummary],
    },
    createAllocation: {
      invalidatesTags: [Tag.Allocation, Tag.AllocationSummary],
    },
    updateAllocation: {
      invalidatesTags: [Tag.Allocation, Tag.AllocationSummary],
    },
    submitAllocationForApproval: {
      invalidatesTags: [Tag.Allocation, Tag.AllocationSummary],
    },
    approveAllocation: {
      invalidatesTags: [Tag.Allocation, Tag.AllocationSummary],
    },
    rejectAllocation: {
      invalidatesTags: [Tag.Allocation, Tag.AllocationSummary],
    },

    //Bank
    getAllBankAllocations: {
      providesTags: [Tag.BankAllocation],
    },
    setBankAllocation: {
      invalidatesTags: [Tag.BankAllocation],
    },
    submitBankAllocationForApproval: {
      invalidatesTags: [Tag.BankAllocation],
    },
    approveBankAllocation: {
      invalidatesTags: [Tag.BankAllocation],
    },
    rejectBankAllocation: {
      invalidatesTags: [Tag.BankAllocation],
    },
  },
});

export default enhancedApi;
