const express = require("express");
const { uploadFile, deleteFile } = require("../middlewares/cloudinary");
const { isAuth } = require("../middlewares/auth");
const Appointments = require("../models/appointments.model");
const User = require("../models/users.model");
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


router.post("/create", [isAuth], uploadFile.single("img"), async (req, res, next) => {
  const userID = req.user._id;
  try {
    const user = await User.findById(userID)
    const userAppointments = user.appointment;
    const appointments = req.body;
    if (req.file) {
      appointments.img = req.file.path;
    }
    const newAppointments = new Appointments(appointments);
    const created = await newAppointments.save();
    userAppointments.push(created._id.toString())
    user.appointment = userAppointments;
    const userModify = new User(user);
    userModify._id = userID;
    const userModified = await User.findByIdAndUpdate(userID, userModify);
    console.log(userModified)
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete/:id", [isAuth], async (req, res, next) => {
  const userID = req.user._id;
  try {
    const user = await User.findById(userID)
    const userAppointments = user.appointment;
    const id = req.params.id;
    const index = userAppointments.indexOf(id);
    userAppointments.splice(index, 1);
    user.appointment = userAppointments;
    const userModify = new User(user);
    userModify._id = userID;
    await User.findByIdAndUpdate(userID, userModify);
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