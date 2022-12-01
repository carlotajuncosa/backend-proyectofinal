const express = require("express");
const { uploadFile, deleteFile } = require("../middlewares/cloudinary");
const Doctor = require("../models/doctors.model");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allDoctors = await Doctor.find();
    return res.status(200).json(allDoctors);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const doctorToFind = await Doctor.findById(id);
    return res.status(200).json(doctorToFind);
  } catch (error) {
    return next(error);
  }
});

router.post("/create", uploadFile.single("img"), async (req, res, next) => {
  try {
    const doctor = req.body;
    if (req.file) {
      doctor.img = req.file.path;
    }
    const newDoctor = new Doctor(doctor);
    const created = await newDoctor.save();
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const doctor = await Doctor.findById(id);
    if (doctor.img) {
      deleteFile(doctor.img);
    }
    const doctorToDelete = await Doctor.findByIdAndDelete(id);
    return res.status(200).json(`The 'doctor' has been deleted --> ${doctorToDelete}`);
  } catch (error) {
    return next(error);
  }
});

router.put("/edit/:id", uploadFile.single("img"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const doctorDb = await Doctor.findById(id);
    if (doctorDb.img) {
      deleteFile(doctorDb.img);
    }
    const doctor = req.body;
    if (req.file) {
      doctor.img = req.file.path;
    }
    const doctorModify = new Doctor(doctor);
    doctorModify._id = id;
    const doctorUpdated = await Doctor.findByIdAndUpdate(id, doctorModify);
    return res.status(200).json(`Successfully updated --> ${doctorUpdated}`);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;