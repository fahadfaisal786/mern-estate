import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Using Gmail for example
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail password or App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

export default sendMail;

// import nodemailer from "nodemailer";

// // Load environment variables from .env file

// // Function to send email
// const sendMail = async (to, subject, text) => {
//   try {
//     // Create a transporter object using the Gmail service
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // Your Gmail email from .env
//         pass: process.env.EMAIL_PASS, // Your Gmail app password from .env
//       },
//     });

//     // Define the email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER, // Sender address
//       to,
//       subject,
//       text, // Plain text email content
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//     return info;
//   } catch (error) {
//     console.error("Error sending email: ", error);
//     throw error;
//   }
// };

// export default sendMail;
