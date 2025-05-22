import { SMSApi } from "../SMSApi";
import { Tag } from "./tags";

const enhancedApi = SMSApi.enhanceEndpoints({
  addTagTypes: [Tag.Users, Tag.UserDetail],
  endpoints: {
    users: {
      providesTags: [Tag.Users, Tag.UserDetail],
    },
    getUserDetail: {
      providesTags: [Tag.Users, Tag.UserDetail],
    },
    activateUser: {
      invalidatesTags: [Tag.Users, Tag.UserDetail],
    },
    deactivateUser: {
      invalidatesTags: [Tag.Users, Tag.UserDetail],
    },
    addUserRole: {
      invalidatesTags: [Tag.Users, Tag.UserDetail],
    },
    removeUserRole: {
      invalidatesTags: [Tag.Users, Tag.UserDetail],
    },
  },
});

export default enhancedApi;
