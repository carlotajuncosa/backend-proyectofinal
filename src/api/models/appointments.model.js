const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appointmentsSchema = new Schema(
  {
    specialty: { type: String, required: true, trim: true},
    day: { type: String, required: true, trim: true },
    hour: { type: String, required: true, trim: true }, 
    modality: { type: String, required: true, trim: true},
    file: [{ type: String, trim: true }],
    patient: [{type: mongoose.Types.ObjectId, ref: "patients"}],
    doctor: [{type: mongoose.Types.ObjectId, ref: "doctors"}],
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("appointments", appointmentsSchema);

module.exports = Appointment;
