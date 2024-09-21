const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const TransactionHistory = require("../models/transactionHistory.model");

const transferMoneyController = {};

transferMoneyController.index = async (req, res, next) => {
  try {
    const { transferAmount, transferPinNumber, userAccountNumber } = req.body;
    const user = await User.findOne({ _id: req.user.userId });

    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "User not found" });
    }
    if (user.balance < parseFloat(transferAmount)) {
      return res.status(400).json({
        status: "failed",
        message: "Insufficient Balance",
      });
    }

    const userNumber = userAccountNumber.slice(1, 11);

    const findUserAccountNumber = await User.findOne({
      mobileNumber: userNumber,
    });

    if (!findUserAccountNumber) {
      return res.status(400).json({
        status: "failed",
        message: "User not found",
      });
    }

    if (user.balance < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Insufficient Balance",
      });
    }

    if (user.mobileNumber === userNumber) {
      return res.status(400).json({
        status: "failed",
        message: "You cannot transfer to yourself",
      });
    }

    const newTransaction = new TransactionHistory({
      userId: user._id,
      transactionHistoryBank: `Send Money`,
      transactionHistoryAccountNumber: userAccountNumber,
      transactionHistoryAmount: parseFloat(transferAmount),
      transactionType: `Receive Money`,
      isActive: true,
    });

    const isPasswordCorrect = await bcrypt.compare(
      transferPinNumber,
      user.pinNumber
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect Phone or Pin Number",
      });
    }
    user.transactionHistory.push(newTransaction._id);
    user.balance -= parseFloat(transferAmount);

    findUserAccountNumber.transactionHistory.push(newTransaction._id);
    findUserAccountNumber.balance += parseFloat(transferAmount);

    await user.save();
    await findUserAccountNumber.save();
    await newTransaction.save();

    res.status(200).json({
      status: "success",
      balance: user.balance,
      successMsg: "Successfully Transferred",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = transferMoneyController;
