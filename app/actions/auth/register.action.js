"use server";

import { registerSchema } from "@/lib/validators/register-schema";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { hash } from "bcryptjs";

export const registerUser = async (data) => {
  try {
    await dbConnect();

    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
      return { error: validation.error.flatten().fieldErrors };
    }

    const { firstName, lastName, email, password, isEducator } =
      validation.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return { error: { message: "Email already registered" } };
    }

    const userName =
      firstName.toLowerCase() +
      "-" +
      lastName.toLowerCase() +
      "-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 10000);

    const hashedPassword = await hash(password, 12);

    const role = "student";

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userName,
      role,
    });

    await newUser.save();

    return {
      redirectTo: isEducator ? "/account/become-educator" : "/",
    };
  } catch (error) {
    return { error: { message: "Server error, please try again later." } };
  }
};
