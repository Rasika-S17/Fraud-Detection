require('dotenv').config({ path: __dirname + '/../.env' });

console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);
console.log("POLICE_PHONE_NUMBER:", process.env.POLICE_PHONE_NUMBER);

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const app = express();

// Add this code to parse incoming JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  // This is important to parse JSON data

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

// POST route to check the transaction
app.post('/check-transaction', async (req, res) => {
    const { transaction } = req.body;

    console.log(`Received transaction: ${JSON.stringify(transaction)}`);

    const { amount, userPhoneNumber } = transaction;

    if (!userPhoneNumber || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid transaction data' });
    }

    // Trigger action if amount > 10000
    if (amount > 10000) {
        try {
            const message = await twilioClient.messages.create({
                body: `Alert! Suspicious transaction detected for an amount of ₹${amount}. Please reply with 'YES' to confirm or 'NO' to reject.`,
                to: userPhoneNumber, 
                from: twilioPhoneNumber,
            });

            console.log(`Message sent to ${userPhoneNumber}: ${message.sid}`);
            res.status(200).json({ message: 'Suspicious transaction detected. SMS sent to the user.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to send the SMS.' });
        }
    } else {
        res.status(200).json({ message: 'Transaction normal. No action taken.' });
    }
});

// POST route to handle the user's response to the SMS
app.post('/sms-reply', (req, res) => {
    const userReply = req.body.Body.trim().toLowerCase();  // Get the reply content
    const fromNumber = req.body.From;  // Get the phone number of the user

    console.log(`Received reply from ${fromNumber}: ${userReply}`);

    if (userReply === 'yes') {
        res.send('<Response><Message>Thank you for confirming the transaction.</Message></Response>');
    } else if (userReply === 'no') {
        res.send('<Response><Message>We are flagging this transaction as suspicious. Thank you.</Message></Response>');
    } else {
        res.send('<Response><Message>Please reply with YES or NO only.</Message></Response>');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
