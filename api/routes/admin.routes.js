// // src/routes/admin.routes.js
// import express from "express";
// import { verifyToken } from "../utils/auth.js"; // Your verifyToken middleware
// import { getAllUsers, deleteUser } from "../controllers/admin.controller.js";

// const router = express.Router();

// // Middleware to check if user is admin
// const isAdmin = (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return res.status(403).json({ message: "Access denied" });
//   }
//   next();
// };

// // Get all users (only for admin)
// router.get("/users", verifyToken, isAdmin, getAllUsers);

// // Delete a user (only for admin)
// router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

// export default router;

// admin.routes.js
// import express from "express";
// import { getAllUsers } from "../controllers/admin.controller.js";

// const router = express.Router();

// // Admin routes
// router.get("/users", getAllUsers);

// export default router;
// src/routes/admin.routes.js
import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import User from "../models/user.model.js";
// import User from "../models/user.model.js";

const router = express.Router();

// Get all users
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// Delete a user
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
