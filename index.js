// Install necessary packages:
// npm install express body-parser nodemailer dotenv

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors"); // Add this line
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Add this line
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Geekyms API");
});

app.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject) {
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
    subject: `${subject} from ${name} <${email}>`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).send(`Error sending message: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
