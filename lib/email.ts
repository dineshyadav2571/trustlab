import { env } from "@/lib/env";

type BrevoEmailInput = {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
};

export async function sendTransactionalEmail(input: BrevoEmailInput) {
  if (!env.brevoApiKey || !env.brevoSenderEmail) {
    throw new Error(
      "Missing BREVO_API_KEY or BREVO_SENDER_EMAIL for transactional emails.",
    );
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": env.brevoApiKey,
    },
    body: JSON.stringify({
      sender: {
        email: env.brevoSenderEmail,
        name: env.brevoSenderName,
      },
      to: [
        {
          email: input.toEmail,
          name: input.toName ?? input.toEmail,
        },
      ],
      subject: input.subject,
      htmlContent: input.htmlContent,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo email failed (${response.status}): ${body}`);
  }
}
