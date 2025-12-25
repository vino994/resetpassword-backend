import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config(); // 🔥 REQUIRED

const client = SibApiV3Sdk.ApiClient.instance;

// 🔐 AUTH FIX (THIS IS THE KEY)
const apiKeyAuth = client.authentications["api-key"];
apiKeyAuth.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, html) => {
  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("✅ Brevo email sent:", response.messageId);
    return true;
  } catch (err) {
    console.error("❌ Brevo FULL ERROR ↓↓↓");
    console.error(err.response?.body || err);
    return false;
  }
};

export default sendEmail;
