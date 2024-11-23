// Install necessary packages:
// npm install express body-parser nodemailer dotenv

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Geekyms API");
});

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields are required");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MAIL_USERNAME,
    subject: `Message from ${name} and email is ${email}`,
    text: message,
  };

  try {
    const data = await transporter.sendMail(mailOptions);
    res.status(200).send("Message sent successfully");
  } catch (error) {
    res.status(500).send("Error sending message");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
