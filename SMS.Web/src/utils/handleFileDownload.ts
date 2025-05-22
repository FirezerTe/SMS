export const handleFileDownload =
  (fileName: string) => async (response: Response) => {
    if (response.status !== 200) {
      return response;
    }
    const blob = await response.blob();
    const alink = document.createElement("a");
    alink.href = window.URL.createObjectURL(blob);
    alink.download = `${
      fileName ||
      (
        response.headers
          .get("content-disposition")
          ?.split("filename=")[1]
          .split(";")[0] as string
      )
        ?.replace(/[^a-z0-9]/gi, "_")
        .toLowerCase() ||
      "sms-document"
    }`;
    alink.click();
    return null;
  };
