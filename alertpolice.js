import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Function to alert the police
const alert = (userPhoneNumber) => {
  const policePhoneNumber = process.env.POLICE_PHONE_NUMBER; // Load police number from environment variables

  return new Promise((resolve, reject) => {
    client.messages.create({
      body: `Alert! A fraud transaction was detected from user ${userPhoneNumber}. Immediate attention needed.`,
      to: policePhoneNumber, // Police phone number
      from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number
    })
    .then((message) => resolve(message))
    .catch((error) => reject(error));
  });
};

export default { alert };
