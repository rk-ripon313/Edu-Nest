import { Types } from "mongoose";

export interface Enrollment {
  _id: Types.ObjectId;

  student: Types.ObjectId;

  content: Types.ObjectId;
  onModel: "Book" | "StudySeries";

  price: number;

  status: "pending" | "free" | "paid" | "cancelled";
  paymentMethod: "stripe" | "sslcommerz" | "free" | "manual";

  transactionId?: string;

  createdAt: Date;
  updatedAt: Date;
}
