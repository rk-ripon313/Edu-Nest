"use server";
import { signIn } from "@/auth";
import { dbConnect } from "@/service/mongo";

export const credentialLogin = async ({ email, password }) => {
  try {
    await dbConnect();

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (response?.error) {
      return { error: response.error };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Invalid Credentials" };
  }
};
