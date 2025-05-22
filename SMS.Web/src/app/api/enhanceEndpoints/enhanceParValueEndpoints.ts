import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [Tag.ParValue],
  endpoints: {
    getAllParValues: {
      providesTags: [Tag.ParValue],
    },
    createParValue: {
      invalidatesTags: [Tag.ParValue],
    },
    submitParValueForApproval: {
      invalidatesTags: [Tag.ParValue],
    },
    updateParValue: {
      invalidatesTags: [Tag.ParValue],
    },
    approveParValue: {
      invalidatesTags: [Tag.ParValue],
    },
    rejectParValue: {
      invalidatesTags: [Tag.ParValue],
    },
  },
});

export default enhancedApi;
