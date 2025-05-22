import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [Tag.SubscriptionGroup],
  endpoints: {
    getSubscriptionGroupById: {
      providesTags: [Tag.SubscriptionGroup],
    },
    getAllSubscriptionGroups: {
      providesTags: [Tag.SubscriptionGroup],
    },
    createSubscriptionGroup: {
      invalidatesTags: [Tag.SubscriptionGroup],
    },
    updateSubscriptionGroup: {
      invalidatesTags: [Tag.SubscriptionGroup],
    },
  },
});

export default enhancedApi;
