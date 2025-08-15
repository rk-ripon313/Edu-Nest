"use server";
import { Button } from "@/components/ui/button";
import {
  createNewEnrollment,
  getHasEnrollment,
} from "@/database/queries/enrollments-data";
import { formatPrice } from "@/lib/formetPrice";
import { sendEmails } from "@/lib/sendEmails";

import { getCurrentUser } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { CheckCircle, XCircle } from "lucide-react";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const EnrollSuccessPage = async ({ searchParams }) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const sessionId = searchParams?.session_id;
  const onModel = searchParams?.onModel;
  const itemId = searchParams?.itemId;

  // Early return for invalid params
  if (!sessionId || !onModel || !itemId) {
    return (
      <ErrorDisplay title="Invalid Session" message="Missing importent Data." />
    );
  }

  const isSeries = onModel === "StudySeries";
  let itemName = "";
  let itemImage = null;
  let paymentMethod = "Stripe";
  let amountPaid = 0;
  const contentUrl = isSeries
    ? `/study-series/${itemId}/play`
    : `/books/${itemId}/read`;

  try {
    // Verify payment from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "payment_intent",
        "payment_intent.charges.data.balance_transaction",
        "line_items.data.price.product",
      ],
    });

    if (!checkoutSession) {
      return (
        <ErrorDisplay
          title="Payment Verification Failed"
          message="Could not retrieve checkout session from Stripe."
        />
      );
    }

    const paymentIntent = checkoutSession.payment_intent;
    const paymentStatus = paymentIntent?.status;
    paymentMethod = paymentIntent?.payment_method_types?.[0];
    amountPaid = checkoutSession.amount_total
      ? checkoutSession.amount_total / 100
      : 0;
    const itemMetadata = checkoutSession.metadata || {};
    itemName =
      checkoutSession.line_items?.data?.[0]?.description ||
      itemMetadata.itemName ||
      "Your Purchased Content";
    itemImage =
      checkoutSession.line_items?.data?.[0]?.price?.product?.images?.[0] ||
      itemMetadata.itemImage;

    if (paymentStatus === "succeeded") {
      // Already enrolled check
      const existing = await getHasEnrollment(onModel, itemId);

      if (!existing) {
        // Create new enrollment
        const enrollment = await createNewEnrollment({
          student: new mongoose.Types.ObjectId(user.id),
          onModel,
          content: new mongoose.Types.ObjectId(itemId),
          price: amountPaid,
          status: "paid",
          paymentMethod: "stripe",
          transactionId: paymentIntent?.id,
        });
        if (!enrollment) {
          return (
            <ErrorDisplay
              title={"Failed to Save in Database "}
              message={"Try Again!"}
            />
          );
        }

        // Send Emails
        const studentName =
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.name;
        const studentEmail = user.email;

        const educatorName = itemMetadata.educatorName || "Educator";
        const educatorEmail = itemMetadata.educatorEmail;
        const cardHolderEmail =
          paymentIntent?.charges?.data?.[0]?.billing_details?.email;

        const emailsToSend = [
          {
            to: educatorEmail,
            subject: `New Enrollment for ${itemName}`,
            message: `Hi ${educatorName}, a new student, ${studentName}, has enrolled in your ${
              isSeries ? "study series" : "book"
            } "${itemName}".`,
          },
          {
            to: studentEmail,
            subject: `Enrollment Success for ${itemName}`,
            message: `Hi ${studentName}, you have successfully enrolled in the ${
              isSeries ? "study series" : "book"
            } "${itemName}".`,
          },
        ];
        // Add card holder email if different from student
        if (cardHolderEmail && cardHolderEmail !== studentEmail) {
          emailsToSend.push({
            to: cardHolderEmail,
            subject: `Payment received for ${itemName}`,
            message: `Hi, the payment for ${itemName} by student ${studentName} was successfully received from your card.`,
          });
        }
        //sent emails fn
        await sendEmails(emailsToSend);
      }
    } else {
      return (
        <ErrorDisplay
          title="Payment Failed"
          message={`Payment was not successful. Status: ${paymentStatus}`}
        />
      );
    }
  } catch (err) {
    <ErrorDisplay
      title="Payment Failed!"
      message={`${err?.message} || "something went rong`}
    />;
  }

  // Main JSX
  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md bg-slate-100 dark:bg-slate-950 w-full rounded-xl shadow-lg p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
        <h2 className="mt-4 text-2xl font-bold">Enrollment Successful!</h2>

        {/* Content Name */}
        <p className="mt-2 text-gray-700 font-medium">{`You are now enrolled in "${itemName}".`}</p>

        {/* Item Image */}
        {itemImage && (
          <div className="mt-4 w-32 h-32 mx-auto relative">
            <Image
              src={itemImage}
              alt={itemName}
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}

        {/* Payment Info */}
        <div className="mt-4 text-gray-600 space-y-1">
          <p>
            <span className="font-semibold">Paid Amount:</span>{" "}
            {formatPrice(amountPaid)}
          </p>
          <p>
            <span className="font-semibold">Payment Method:</span>{" "}
            {paymentMethod}
          </p>
        </div>

        {/* Go to Content */}
        <Button asChild className="mt-6 w-full">
          <Link href={contentUrl}>Go to Content</Link>
        </Button>
      </div>
    </div>
  );
};

export default EnrollSuccessPage;

// Error display component
const ErrorDisplay = ({ title, message }) => (
  <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto  rounded-xl shadow-md overflow-hidden p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full 0">
        <XCircle className="h-6 w-6 text-red-600" />
      </div>
      <h1 className="mt-3 text-xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 ">{message}</p>
      <Button
        href="#"
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Contact Support
      </Button>
    </div>
  </div>
);
