
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
    res.send("Portfolio Backend is Running!");
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        const { data, error } = await resend.emails.send({
            from: "My Portfolio <onboarding@resend.dev>",
            to: [process.env.EMAIL_USER],
            replyTo: email,
            subject: `Portfolio Contact - ${subject}`,
            text: `New message from your portfolio website.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`
        });

        if (error) {
            console.error("Resend Error:", error);

            return res.status(500).json({
                success: false,
                message: "Email delivery failed. Please try again."
            });
        }

        console.log("Email sent successfully:", data?.id);

        return res.status(200).json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {
        console.error("Contact API Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send message right now."
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
