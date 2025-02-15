import express from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/scholarshipController";

const router = express.Router();

// Scholarship routes
router.get("/scholarships", authenticateToken, getScholarships);
router.post("/scholarships", authenticateToken, createScholarship);
router.put("/scholarships/:id", authenticateToken, updateScholarship);
router.delete("/scholarships/:id", authenticateToken, deleteScholarship);

// Application routes
router.get("/applications", authenticateToken, getApplications);
router.post("/applications", authenticateToken, createApplication);
router.put("/applications/:id", authenticateToken, updateApplication);
router.delete("/applications/:id", authenticateToken, deleteApplication);

export default router;
