const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorsSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    registration_number: { type: Number, required: true, trim: true, unique: true},
    specialty: { type: String, required: true, trim: true },
    img: { type: String, required: true, trim: true },
    appointment: [{type: mongoose.Types.ObjectId, ref: "appointments"}],
    user: [{type: mongoose.Types.ObjectId, ref: "users"}],
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("doctors", doctorsSchema);

module.exports = Doctor;
