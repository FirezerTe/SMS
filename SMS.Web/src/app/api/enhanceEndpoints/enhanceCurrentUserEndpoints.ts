import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [Tag.CurrentUser],
  endpoints: {
    currentUserInfo: {
      providesTags: [Tag.CurrentUser],
    },
    logout: {
      invalidatesTags: [Tag.CurrentUser],
    },
    login: {
      invalidatesTags: [Tag.CurrentUser],
    },
    verificationCode: {
      invalidatesTags: [Tag.CurrentUser],
    },
  },
});

export default enhancedApi;
