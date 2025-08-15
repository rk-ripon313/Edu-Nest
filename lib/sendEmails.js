import EmailTemplate from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmails = async (emailInfo) => {
  if (!emailInfo || !Array.isArray(emailInfo)) return null;

  const results = await Promise.allSettled(
    emailInfo.map(async (data) => {
      try {
        if (!data.to || !data.subject || !data.message) {
          throw new Error(
            `Couldn't send email, check this data: ${JSON.stringify(data)}`
          );
        }

        const sentInfo = await resend.emails.send({
          from: "onboarding@resend.dev", //noreply@ndu-nest.com
          to: data.to,
          subject: data.subject,
          react: <EmailTemplate message={data.message} />,
        });

        return sentInfo;
      } catch (err) {
        console.error("Email failed:", err);
        throw err;
      }
    })
  );

  return results;
};
