import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  const formData = await req.formData();
  const files = formData.getAll("file");
  const subFolder = formData.get("subFolder") || "";

  if (!files || files.length === 0) {
    return NextResponse.json(
      { success: false, message: "No file provided" },
      { status: 400 }
    );
  }

  try {
    const uploadedUrls = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader

          .upload_stream(
            {
              folder: `Edu-Nest${subFolder ? `/${subFolder}` : ""}`,
            },
            (err, res) => (err ? reject(err) : resolve(res))
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
