import fs from "fs/promises";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import path from "path";

export const POST = async (req) => {
  const uploadDir = path.join(process.cwd(), "tmp");
  let tempPath = null;

  try {
    //  Ensure tmp folder exists
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Failed to create tmp directory:", err);
      throw err;
    }

    //  Parse formData
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title") || "Untitled Video";
    const description = formData.get("description") || "";

    // if (!file) {
    //   return new Response(JSON.stringify({ error: "No video file uploaded" }), {
    //     status: 400,
    //   });
    // }

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No video file uploaded" },
        { status: 400 }
      );
    }

    //  Convert uploaded file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    //  Check file size (400MB limit)
    const MAX_SIZE = 400 * 1024 * 1024;
    if (buffer.byteLength > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: "File too large. Max 400MB allowed." }),
        { status: 400 }
      );
    }

    ////  Write temp file
    tempPath = path.join(uploadDir, `upload_${Date.now()}_${file.name}`);
    await fs.writeFile(tempPath, buffer);

    // Setup OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    // Important: use refresh token here
    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    //  Upload to YouTube
    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus: "unlisted" },
      },
      media: { body: (await import("fs")).createReadStream(tempPath) },
    });

    // Get video info url
    const videoId = res.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Get duration with retry
    // const duration = await getVideoDurationWithRetry(youtube, videoId);

    //  Return final  response
    return NextResponse.json(
      { success: true, message: " video uploaded !", data: videoUrl },
      { status: 200 }
    );
    // catch block
  } catch (error) {
    console.error("YouTube Upload Error:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Unknown error" },
      { status: 500 }
    );
    //finally block
  } finally {
    if (tempPath) await fs.unlink(tempPath).catch(() => {});
  }
};

// Wait + Retry duration fetcher
const getVideoDurationWithRetry = async (
  youtube,
  videoId,
  maxRetries = 8,
  delay = 10000
) => {
  for (let i = 0; i < maxRetries; i++) {
    const res = await youtube.videos.list({
      part: ["contentDetails"],
      id: [videoId],
    });

    const durationISO = res.data.items?.[0]?.contentDetails?.duration;
    if (durationISO) {
      console.log(` Duration found on try ${i + 1}`);
      return convertISODurationToSeconds(durationISO);
    }

    console.log(
      ` Try ${i + 1}: duration not ready yet, waiting ${delay / 1000}s...`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.warn("⚠️ Duration not available after multiple retries");
  return 0;
};

//  Helper to convert ISO  duration to seconds
const convertISODurationToSeconds = (iso) => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || 0);
  const mins = parseInt(match[2] || 0);
  const secs = parseInt(match[3] || 0);
  return hours * 3600 + mins * 60 + secs;
};
