export const uploadFileToCloudinary = async (
  file,
  fileType,
  subFolder = ""
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);
  formData.append("subFolder", subFolder);

  const res = await fetch("/api/upload-files", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data?.message || "Upload failed");
  }

  return data.urls;
};
