import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

//controller for creating a new resume
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });
    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//controller for deleting a resume
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ _id: resumeId, userId });
    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//controller for get user resume by id

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not found",
      });
    }
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;
    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not found",
      });
    }
    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//controller for updating a resume

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy = JSON.parse(resumeData);

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });
      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      {
        new: true,
      }
    );
    return res.status(200).json({ message: "Saved Successfully", resume });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
