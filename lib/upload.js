export const uploadFileToCloudinary = async (
  files,
  fileType,
  subFolder = ""
) => {
  const filesArray = Array.isArray(files) ? files : [files];
  const uploadedUrls = [];

  for (const file of filesArray) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);
    formData.append("subFolder", subFolder);

    const res = await fetch("/api/upload-files", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.success) throw new Error(data?.message || "Upload failed");

    uploadedUrls.push(data.urls);
  }

  return filesArray.length === 1 ? uploadedUrls[0] : uploadedUrls;
};
