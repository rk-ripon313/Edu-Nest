//scripts/get-refresh-token.js
import { google } from "googleapis";
import readline from "readline";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\n Enter code here ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("\n Refresh Token  :\n");
    console.log(tokens.refresh_token);
    rl.close();
  } catch (error) {
    console.error(" Error retrieving access token:", error);
    rl.close();
  }
});
