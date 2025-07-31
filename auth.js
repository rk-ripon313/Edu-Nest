import mongooClientPromise from "@/database/mongooClientPromise";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { UserModel } from "./models/user-model";

//  Custom JWT for Credentials login
const signCustomToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.CUSTOM_JWT_SECRET,
    { expiresIn: "2d" }
  );
};

//  Refresh Token handler for Google login
const refreshAccessToken = async (token) => {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(mongooClientPromise, {
    databaseName: process.env.ENVIRONMENT,
  }),
  session: {
    strategy: "jwt",
  },
  ...authConfig,

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await UserModel.findOne({ email: credentials.email });
        if (!user || !user.password)
          throw new Error("Invalid Email or Password");

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) throw new Error("Invalid Email or Password");

        const customAccessToken = signCustomToken(user);

        return {
          email: user.email,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image || null,
          role: user.role,
          customAccessToken,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      //  First login
      if (user) {
        // Credentials login
        if (!account || account.provider === "credentials") {
          token.customAccessToken = user.customAccessToken;
          token.role = user.role;
          token.name = user.name;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.email = user.email;
          token.image = user.image;
        }

        // Google login
        if (account?.provider === "google") {
          const googleUser = user._json || user;
          token.accessToken = account.access_token;
          token.accessTokenExpires = Date.now() + account.expires_in * 1000;
          token.refreshToken = account.refresh_token;
          token.user = {
            name: googleUser.name,
            email: googleUser.email,
            image: user.image || googleUser.picture || null,
            role: googleUser.role,
          };
        }
      }

      //  Google token still valid
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      //  Google token expired → refresh
      if (token?.refreshToken) {
        return await refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.customAccessToken) {
        session.user = {
          accessToken: token.customAccessToken,
          name: token.name,
          email: token.email,
          image: token.image,
          role: token.role,
          firstName: token.firstName,
          lastName: token.lastName,
        };
      } else if (token?.user) {
        session.user = token.user;
      }

      if (token?.error) {
        session.error = token.error;
      }

      return session;
    },
  },
});
