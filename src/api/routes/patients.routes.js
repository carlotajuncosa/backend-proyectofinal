const express = require("express");
const { isAuth } = require("../middlewares/auth");
const { uploadFile, deleteFile } = require("../middlewares/cloudinary");
const Patient = require("../models/patients.model");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allPatients = await Patient.find();
    return res.status(200).json(allPatients);
  } catch (error) {
    return next(error);
  }
});


router.get("/byUser/", [isAuth], async (req, res, next) => {
  try {
    const userID = req.user._id;
    const patient = await Patient.find({user: userID});
    return res.status(200).json(patient);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const patientToFind = await Patient.findById(id);
    return res.status(200).json(patientToFind);
  } catch (error) {
    return next(error);
  }
});

router.post("/create", [isAuth],uploadFile.single("img"), async (req, res, next) => {
  const userID = req.user._id;
  try {
    const patient = req.body;
    if (req.file) {
      patient.img = req.file.path;
    }
    patient.user = userID
    const newPatient = new Patient(patient);
    const created = await newPatient.save();
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const patient = await Patient.findById(id);
    if (patient.img) {
      deleteFile(patient.img);
    }
    const patientToDelete = await Patient.findByIdAndDelete(id);
    return res.status(200).json(`The 'patient' has been deleted --> ${patientToDelete}`);
  } catch (error) {
    return next(error);
  }
});

router.put("/edit/", [isAuth], uploadFile.single("img"), async (req, res, next) => {
  const userID = req.user._id;
  try {
    const patientDb = await Patient.find({user: userID});
    const id = patientDb[0]._id;
    if (req.file && patientDb[0].img) {
      deleteFile(patientDb[0].img);
    }
    const patient = req.body;
    if (req.file) {
      patient.img = req.file.path;
    } else (patient.img = patientDb[0].img)
    const patientModify = new Patient(patient);
    patientModify._id = id;
    patientModify.user = userID;
    const patientUpdated = await Patient.findByIdAndUpdate(id, patientModify);
    return res.status(200).json(`Successfully updated --> ${patientUpdated}`);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;