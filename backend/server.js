const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Portfolio Backend is Running!");
});


 // Email transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
});

// Contact form API
app.post("/api/contact", async (req, res) => {

    try {

        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });

        }

        // Email details
        const mailOptions = {

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            replyTo: email,

            subject: `Portfolio Contact - ${subject}`,

            text: `
You received a new message from your portfolio website.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({

            success: true,

            message: "Message sent successfully!"

        });

    } catch (error) {

        console.error("Email Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to send message."

        });

    }

});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});