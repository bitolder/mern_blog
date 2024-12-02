import express from "express";
import {
  deleteUser,
  getUsers,
  signoutUser,
  test,
  updateUser,
  adminDeleteUser,
  getUserWhoCommented,
} from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUsers.js";

const router = express.Router();
router.get("/test", test);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/signout", signoutUser);
router.get("/getUsers", verifyToken, getUsers);
router.delete("/delete/:idUser/:idAdmin", verifyToken, adminDeleteUser);
router.get("/:userId", getUserWhoCommented);

export default router;
