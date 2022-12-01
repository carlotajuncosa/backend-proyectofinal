const express = require("express");
const { uploadFile, deleteFile } = require("../middlewares/cloudinary");
const Appointments = require("../models/appointments.model");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allAppointmentss = await Appointments.find();
    return res.status(200).json(allAppointmentss);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const appointmentsToFind = await Appointments.findById(id);
    return res.status(200).json(appointmentsToFind);
  } catch (error) {
    return next(error);
  }
});

router.post("/create", uploadFile.single("img"), async (req, res, next) => {
  try {
    const appointments = req.body;
    if (req.file) {
      appointments.img = req.file.path;
    }
    const newAppointments = new Appointments(appointments);
    const created = await newAppointments.save();
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const appointments = await Appointments.findById(id);
    if (appointments.img) {
      deleteFile(appointments.img);
    }
    const appointmentsToDelete = await Appointments.findByIdAndDelete(id);
    return res.status(200).json(`The 'appointments' has been deleted --> ${appointmentsToDelete}`);
  } catch (error) {
    return next(error);
  }
});

router.put("/edit/:id", uploadFile.single("img"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const appointmentsDb = await Appointments.findById(id);
    if (appointmentsDb.img) {
      deleteFile(appointmentsDb.img);
    }
    const appointments = req.body;
    if (req.file) {
      appointments.img = req.file.path;
    }
    const appointmentsModify = new Appointments(appointments);
    appointmentsModify._id = id;
    const appointmentsUpdated = await Appointments.findByIdAndUpdate(id, appointmentsModify);
    return res.status(200).json(`Successfully updated --> ${appointmentsUpdated}`);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;