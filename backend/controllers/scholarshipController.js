const { Scholarship, Application } = require("../models/Scholarship");

// Scholarship Controllers
exports.getScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.status(200).json(scholarships);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scholarships", error });
  }
};

exports.createScholarship = async (req, res) => {
  try {
    const scholarship = new Scholarship(req.body);
    await scholarship.save();
    res.status(201).json(scholarship);
  } catch (error) {
    res.status(500).json({ message: "Error creating scholarship", error });
  }
};

exports.updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res.status(200).json(scholarship);
  } catch (error) {
    res.status(500).json({ message: "Error updating scholarship", error });
  }
};

exports.deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res.status(200).json({ message: "Scholarship deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting scholarship", error });
  }
};

// Application Controllers
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("scholarship")
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      student: req.user._id,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Error creating application", error });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      req.body,
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Error updating application", error });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id,
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting application", error });
  }
};
