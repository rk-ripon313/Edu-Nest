"use server";

import {
  createNewEnrollment,
  getHasEnrollment,
} from "@/database/queries/enrollments-data";
import { getCurrentUser } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { formatAmountForStripe } from "@/lib/stripe-helpers";
import { replaceMongoIdInObject } from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { StudySeriesModel } from "@/models/StudySeries-model";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

const currency = "BDT";

export const createCheckoutSessionAction = async ({ itemId, isSeries }) => {
  if (!itemId) return { success: false, error: "ITEM_NOT_FOUND" };

  const user = await getCurrentUser();
  if (!user?.id || !user?.email) {
    return { success: false, error: "UNAUTHENTICATED" };
  }

  try {
    await dbConnect();
    const origin = process.env.NEXT_PUBLIC_BASE_URL;

    const onModel = isSeries ? "StudySeries" : "Book";

    // Check existing enrollment
    const hasEnrollment = await getHasEnrollment(onModel, itemId);
    if (hasEnrollment) {
      return { success: false, error: "ALREADY_ENROLLED" };
    }

    // Fetch item info
    const enrollItem = isSeries
      ? await StudySeriesModel.findById(itemId)
          .select("title price description thumbnail")
          .populate({
            path: "educator",
            model: UserModel,
            select: "firstName lastName name email",
          })
          .lean()
      : await BookModel.findById(itemId)
          .select("title price description thumbnail")
          .populate({
            path: "educator",
            model: UserModel,
            select: "firstName lastName name email",
          })
          .lean();

    if (!enrollItem) {
      return { success: false, error: "ITEM_NOT_FOUND" };
    }

    const item = replaceMongoIdInObject(enrollItem);

    // Free enrollment (no payment)
    if (item.price === 0) {
      const freeEnrollment = await createNewEnrollment({
        student: new mongoose.Types.ObjectId(user?.id),
        onModel,
        content: new mongoose.Types.ObjectId(item?.id),
        price: 0,
        status: "free",
        paymentMethod: "free",
        transactionId: "Free_Enrollment",
      });

      if (!freeEnrollment) {
        return { success: false, error: "ENROLLMENT_FAILED" };
      }

      revalidatePath(
        isSeries ? `/study-series/${item.id}` : `/books/${item.id}`
      );
      revalidatePath("/");

      return {
        success: true,
        message: "Congratulation! Now you may access this item",
      };
    }

    // Paid checkout with Stripe
    const amount = formatAmountForStripe(item?.price, currency);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "auto",
      payment_method_types: ["card"],
      locale: "auto",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: `${onModel} • ${item.title}`,
              description: item.description,
              images: item?.thumbnail ? [item.thumbnail] : [],
            },
          },
        },
      ],
      payment_intent_data: {
        metadata: {
          userId: user.id,
          userEmail: user.email,
          itemId: item.id,
          educatorName:
            `${item.educator?.firstName || ""} ${
              item.educator?.lastName || ""
            }`.trim() || item.educator?.name,
          educatorEmail: item.educator?.email,
          onModel,
          originalPriceBDT: item.price,
          itemName: item.title,
          itemType: onModel,
          itemImage: item.thumbnail || "",
        },
      },
      success_url: `${origin}/enroll-success?session_id={CHECKOUT_SESSION_ID}&onModel=${onModel}&itemId=${item.id}`,
      cancel_url: `${origin}/${isSeries ? `study-series/${item.id}` : `books/${item.id}`}`,
    });

    return {
      success: true,
      url: checkoutSession.url,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong! Try again." };
  }
};
