import { auth } from "@/auth";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { redirect } from "next/navigation";
import { replaceMongoIdInObject } from "./transformId";

export const getCurrentUser = async () => {
  await dbConnect();

  const session = await auth();
  if (!session?.user) {
    redirect("/login");
    return;
  }

  const res = await UserModel.findOne({
    email: session.user.email,
  })
    .select("-password")
    .lean();

  return replaceMongoIdInObject(res);
};
