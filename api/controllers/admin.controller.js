// // src/controllers/admin.controller.js
// import User from "../models/user.model.js";

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // Exclude passwords
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteUser = async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // src/controllers/admin.controller.js
// import User from "../models/user.model.js"; // Adjust the path to your User model

// // Get all users function
// export const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await User.find({}, "username email"); // Select only username and email fields
//     res.status(200).json(users);
//   } catch (error) {
//     next(error); // Handle any errors
//   }
//}
// src/controllers/admin.controller.js
// import User from '../models/user.model.js'; // Adjust the path to your User model
// import { errorHandler } from '../utils/error.js'; // Adjust the path to your error handler

// // Function to get all users
// export const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await User.find({}, 'username email'); // Select only username and email fields
//     res.status(200).json(users);
//   } catch (error) {
//     next(error); // Handle any errors
//   }
// };

// // Function to delete a user
// export const deleteUser = async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     await User.findByIdAndDelete(userId); // Delete user by ID
//     res.status(200).json({ message: "User deleted successfully." });
//   } catch (error) {
//     next(error); // Handle any errors
//   }
// };

// admin.controller.js
// import User from "../models/User.js";
// admin.controller.js
// import User from "../models/User.js"; // Adjust the path if necessary
import User from "../models/user.model.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
