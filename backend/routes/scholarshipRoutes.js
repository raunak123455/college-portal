const express = require("express");
const router = express.Router();
const {
  getScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/scholarshipController");

// Scholarship routes
router.get("/", getScholarships);
router.post("/", createScholarship);
router.put("/:id", updateScholarship);
router.delete("/:id", deleteScholarship);

// Application routes
router.get("/applications", getApplications);
router.post("/applications", createApplication);
router.put("/applications/:id", updateApplication);
router.delete("/applications/:id", deleteApplication);

module.exports = router;
