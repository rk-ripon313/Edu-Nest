import { auth } from "@/auth";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { replaceMongoIdInObject } from "./transformId";

export const getCurrentUser = async () => {
  await dbConnect();

  const session = await auth();
  if (!session?.user) return null;

  const res = await UserModel.findOne({
    email: session.user.email,
  })
    .select("-password")
    .lean();

  return replaceMongoIdInObject(res);
};
