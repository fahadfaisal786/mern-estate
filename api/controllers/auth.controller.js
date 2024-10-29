import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
// import { sendEmail } from "../utils/emailService.js";
import sendMail from "../utils/sendMail.js";


// Import the User model
// export const signup = async (req, res, next) => {
//   const { username, email, password } = req.body;
//   const hashedPassword = bcryptjs.hashSync(password, 10);
//   const newUser = new User({ username, email, password: hashedPassword });
//   try {
//     await newUser.save();
//     res.status(201).json("User create successfully");
//   } catch (error) {
//     next(error);
//   }
// };

// export const signup = async (req, res, next) => {
//   const { username, email, password } = req.body;

//   try {
//     // Check if a user with the given email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password using bcrypt
//     const hashedPassword = bcryptjs.hashSync(password, 10);

//     // Create a new user instance
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       // avatar is optional, it will use the default URL if not provided
//     });

//     // Save the user to the database
//     await newUser.save();

//     // Respond with success
//     // res.status(201).json({
//     //   message: "User created successfully",
//     //   user: {
//     //     id: newUser._id,
//     //     username: newUser.username,
//     //     email: newUser.email,
//     //     avatar: newUser.avatar,
//     //   },

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       user: { username, email }, // Optionally return user info
//     });
//   } catch (error) {
//     next(error); // Forward error to global error handler
//   }
// };

// export const signup = async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const hashedPassword = bcryptjs.hashSync(password, 10);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     // Send confirmation email
//     await sendEmail(
//       email,
//       "Welcome to Our Service!",
//       `Hello ${username}, your account has been created successfully!`
//     );

//     return res.status(201).json({
//       success: true,
//       message: "User created successfully, a confirmation email has been sent.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken. Please choose another one.",
      });
    }

    // Check if email already exists
    // const existingEmail = await User.findOne({ email });
    // if (existingEmail) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Email is already registered. Please use another email.",
    //   });
    // }

    // Hash the password before saving
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create the new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Send a welcome email after successful sign-up
    await sendMail(email);

    // Send success response
    res.status(201).json({
      success: true,
      message: "User created successfully. Please check your email.",
    });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

// // Sign-up handler
// export const signup = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Code to handle user creation logic (e.g., saving to database)
//     // Assuming user is created successfully, you send a welcome email

//     await sendMail(
//       email, // Recipient email
//       "Welcome to Our Service", // Subject
//       `Hi ${username},\n\nThank you for signing up to our platform! We're excited to have you.` // Message body
//     );

//     res.status(200).json({
//       success: true,
//       message: "User signed up successfully. A welcome email has been sent!",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to sign up user or send email.",
//       error: error.message,
//     });
//   }
// };

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split("").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};
