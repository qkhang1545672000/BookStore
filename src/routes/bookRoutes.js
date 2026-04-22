import express from "express";
import { getBooks } from "../controllers/bookController.js";
const router = express.Router();
router.get("/", getBooks);
// router.post("/", createTask);

// router.put("/:id", updateTask);

// router.delete("/:id", deleteTask);
export default router;
