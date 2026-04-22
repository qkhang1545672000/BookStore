import express from "express";
import {
  createTenant,
  deleteTenant,
  getTenant,
  UpdateTenant,
  UpdateTenantsRoom,
} from "../controllers/tenantController.js";
const router = express.Router();
router.get("/", getTenant);
router.post("/", createTenant);
router.post("/croom", UpdateTenantsRoom);
router.put("/:id", UpdateTenant);

router.delete("/:id", deleteTenant);
export default router;
