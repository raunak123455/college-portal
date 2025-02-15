const express = require("express");
const router = express.Router();
const {
  getAllApplications,
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplication,
  getAgentApplications,
  addApplicationNote,
} = require("../controllers/applicationController");

// Special routes should come before parameter routes
router.get("/agent", getAgentApplications);
router.get("/all", getAllApplications);

// Regular CRUD routes
router.get("/", getApplications);
router.post("/", createApplication);

// Parameter routes should come last
router.get("/:id", getApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);
router.post("/:id/note", addApplicationNote);

module.exports = router;
