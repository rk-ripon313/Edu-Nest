import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");
    const subFolder = formData.get("subFolder") || "";
    const fileType = formData.get("fileType");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }
    const uploadedUrls = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise((resolve, reject) => {
        const uploadOptions = {
          folder: `Edu-Nest${subFolder ? `/${subFolder}` : ""}`,
          resource_type: fileType === "pdf" ? "raw" : "auto",
          format: fileType === "pdf" ? "pdf" : undefined,
          quality: "auto",
          fetch_format: "auto",
        };

        // if video, eager_async using background processing
        if (fileType === "video") {
          uploadOptions.eager = [{ width: 1280, height: 720, format: "mp4" }];
          uploadOptions.eager_async = true;
        }

        cloudinary.uploader
          .upload_stream(uploadOptions, (err, res) =>
            err ? reject(err) : resolve(res)
          )
          .end(buffer);
      });

      uploadedUrls.push(result.secure_url);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Cloudinary upload failed" },
      { status: 500 }
    );
  }
};
