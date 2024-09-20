const { Schema, model } = require("mongoose");

const transactionHistorySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    transactionHistoryBank: {
      type: String,
      required: true,
    },
    transactionHistoryAccountNumber: {
      type: String,
      required: true,
    },
    transactionHistoryAmount: {
      type: Number,
      required: true,
    },
    transactionHistory: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
const TransactionHistory = model(
  "transactionHistory",
  transactionHistorySchema
);
module.exports = TransactionHistory;
