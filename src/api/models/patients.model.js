const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientsSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    phone: { type: Number, required: true, trim: true },
    genre: { type: String, required: true, trim: true, enum: ["undefined", "male", "female"]},
    nif: { type: String, required: true, trim: true, unique: true},
    birth_date: { type: String, required: true, trim: true},
    img: { type: String, required: true, trim: true },
    medical_record: [{type: mongoose.Types.ObjectId, ref: "appointments"}],
    appointment: [{type: mongoose.Types.ObjectId, ref: "appointments"}],
    user: [{type: mongoose.Types.ObjectId, ref: "users", required: true}],
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("patients", patientsSchema);

module.exports = Patient;
