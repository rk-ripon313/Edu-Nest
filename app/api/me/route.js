import { auth } from "@/auth";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const session = await auth();
  const loggedInUser = session?.user;
  if (!loggedInUser) {
    return new NextResponse(`You are not authenticated!`, {
      status: 401,
    });
  }

  await dbConnect();

  try {
    const user = await UserModel.findOne({ email: loggedInUser?.email })
      .select("name firstName lastName email image role")
      .lean();

    return new NextResponse(JSON.stringify(user), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(err?.message, {
      status: 500,
    });
  }
};
