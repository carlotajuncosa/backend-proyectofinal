const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, default: "patient", enum: ["patient", "doctor", "admin"] }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
