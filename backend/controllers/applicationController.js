const Application = require("../models/Application");

// Get all applications (for admin)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first

    console.log("Fetched applications:", applications); // Debug log
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error in getAllApplications:", error); // Debug log
    res.status(500).json({
      message: "Error fetching all applications",
      error: error.message,
    });
  }
};

// Get applications for specific user
const getApplications = async (req, res) => {
  try {
    const userId = "67afa3071920deae0c28792b";
    const applications = await Application.find({ student: userId });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching applications",
      error: error.message,
    });
  }
};

// Create new application
const createApplication = async (req, res) => {
  try {
    const userId = "67afa3071920deae0c28792b";
    const application = new Application({
      ...req.body,
      student: userId,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({
      message: "Error creating application",
      error: error.message,
    });
  }
};

// Get single application
const getApplication = async (req, res) => {
  try {
    const userId = "67afa3071920deae0c28792b";
    const application = await Application.findOne({
      _id: req.params.id,
      student: userId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching application",
      error: error.message,
    });
  }
};

// Update application
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating application:", id, req.body); // Debug log

    // If there's new timeline events, append them to existing ones
    let update = req.body;
    if (req.body.timeline) {
      const application = await Application.findById(id);
      update.timeline = [...application.timeline, ...req.body.timeline];
    }

    const updatedApplication = await Application.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("student", "name email");

    if (!updatedApplication) {
      console.log("Application not found:", id); // Debug log
      return res.status(404).json({ message: "Application not found" });
    }

    console.log("Application updated successfully:", updatedApplication); // Debug log
    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Update error:", error); // Debug log
    res.status(500).json({
      message: "Error updating application",
      error: error.message,
    });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Attempting to delete application:", id); // Debug log

    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      console.log("Application not found:", id); // Debug log
      return res.status(404).json({
        message: "Application not found",
      });
    }

    console.log("Application deleted successfully:", id); // Debug log
    res.status(200).json({
      message: "Application deleted successfully",
      deletedApplication: application,
    });
  } catch (error) {
    console.error("Delete error:", error); // Debug log
    res.status(500).json({
      message: "Error deleting application",
      error: error.message,
    });
  }
};

// Get applications for agent
const getAgentApplications = async (req, res) => {
  try {
    console.log("Fetching agent applications"); // Debug log

    // For now, we'll return all applications for testing
    // Later you can add agent-specific filtering
    const applications = await Application.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    console.log("Found applications:", applications); // Debug log

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error in getAgentApplications:", error);
    res.status(500).json({
      message: "Error fetching agent applications",
      error: error.message,
    });
  }
};

// Add note to application
const addApplicationNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, date } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Add new note to the array
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      {
        $push: {
          agentNotes: {
            note,
            date,
            agent: req.user._id, // Assuming you have user info in request
          },
          timeline: {
            date,
            status: "Agent Note Added",
            comment: note,
            icon: "review",
          },
        },
      },
      { new: true }
    )
      .populate("student", "name email")
      .populate("agentNotes.agent", "name email");

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error in addApplicationNote:", error);
    res.status(500).json({
      message: "Error adding note to application",
      error: error.message,
    });
  }
};

module.exports = {
  getAllApplications,
  getApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  getAgentApplications,
  addApplicationNote,
};
