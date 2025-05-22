import { handleFileDownload } from "../../../utils/handleFileDownload";
import { SMSApi } from "../SMSApi";

const enhancedApi = SMSApi.enhanceEndpoints({
  endpoints: {
    downloadDocument: {
      query: (queryArg) => {
        return {
          url: `/api/Documents/${queryArg.id}/download`,
          responseHandler: handleFileDownload(""),
          cache: "no-cache",
        };
      },
    },
  },
});

export default enhancedApi;
