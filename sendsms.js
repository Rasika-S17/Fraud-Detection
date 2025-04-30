import twilio from 'twilio';
import dotenv from 'dotenv';
import send from './send-sms.js';  // Make sure to include .js extension


dotenv.config();

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Function to send SMS
const send = (phoneNumber, message) => {
  return new Promise((resolve, reject) => {
    client.messages.create({
      body: message,
      to: phoneNumber, // Dynamically use the provided phone number
      from: twilioPhoneNumber, // Use your Twilio phone number
    })
    .then((message) => resolve(message))
    .catch((error) => reject(error));
  });
};

export default { send };
