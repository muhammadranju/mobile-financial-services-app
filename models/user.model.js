const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    pinNumber: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const User = model("User", userSchema);
module.exports = User;
