import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, USER_PHONE_NUMBER } =
    process.env;

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  console.log("Received SMS request:", req.body);


  try {
    const message = await client.messages.create({
      body: req.body.message,
      from: TWILIO_PHONE_NUMBER,
      to: USER_PHONE_NUMBER, // Replace with the recipient number
    });

    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    res.status(500).json({ error: "Failed to send SMS", details: error.message });
  }
  console.log("Received SMS request:", req.body);

}
