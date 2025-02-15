import { Request, Response } from "express";
import { Scholarship, Application } from "../models/Scholarship";

// Scholarship Controllers
export const getScholarships = async (req: Request, res: Response) => {
  try {
    const scholarships = await Scholarship.find();
    res.status(200).json(scholarships);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scholarships", error });
  }
};

export const createScholarship = async (req: Request, res: Response) => {
  try {
    const scholarship = new Scholarship(req.body);
    await scholarship.save();
    res.status(201).json(scholarship);
  } catch (error) {
    res.status(500).json({ message: "Error creating scholarship", error });
  }
};

export const updateScholarship = async (req: Request, res: Response) => {
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

export const deleteScholarship = async (req: Request, res: Response) => {
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
export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("scholarship")
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
};

export const createApplication = async (req: Request, res: Response) => {
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

export const updateApplication = async (req: Request, res: Response) => {
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

export const deleteApplication = async (req: Request, res: Response) => {
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
