const { Schema, model } = require("mongoose");

const addMoneySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    addMoneyBank: {
      type: String,
      required: true,
    },
    addMoneyAccountNumber: {
      type: String,
      required: true,
    },
    addMoneyAmount: {
      type: Number,
      required: true,
    },
    addMoneyPinNumber: {
      type: String,
      required: true,
    },
    isActive: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const AddMoney = model("addMoney", addMoneySchema);
module.exports = AddMoney;
