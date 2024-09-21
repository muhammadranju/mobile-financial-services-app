const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const TransactionHistory = require("../models/transactionHistory.model");

const cashOutController = {};

cashOutController.index = async (req, res, next) => {
  console.log(req.body);
  try {
    const { cashOutAgentNumber, cashOutWithdrawAmount, cashOutPinNumber } =
      req.body;

    const user = await User.findOne({ _id: req.user.userId });

    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "User not found" });
    }

    if (user.balance < parseFloat(cashOutWithdrawAmount)) {
      return res.status(400).json({
        status: "failed",
        message: "Insufficient Balance",
      });
    }
    if (user.balance < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Insufficient Balance",
      });
    }

    if (user.mobileNumber !== cashOutAgentNumber.slice(1, 11)) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect User Account Number",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      cashOutPinNumber,
      user.pinNumber
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect Phone or Pin Number",
      });
    }

    const newTransaction = new TransactionHistory({
      userId: user._id,
      transactionHistoryBank: `Cash Out`,
      transactionHistoryAccountNumber: cashOutAgentNumber,
      transactionHistoryAmount: parseFloat(cashOutWithdrawAmount),
      transactionType: `Cash Out`,
      isActive: true,
    });

    user.transactionHistory.push(newTransaction._id);
    user.balance -= parseFloat(cashOutWithdrawAmount);

    await user.save();
    await newTransaction.save();
    res.status(200).json({
      status: "success",
      balance: user.balance,
      successMsg: "Successfully Cashed Out",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = cashOutController;
