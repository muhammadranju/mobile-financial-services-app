const bcrypt = require("bcryptjs");
const AddMoney = require("../models/addMoney.model");
const TransactionHistory = require("../models/transactionHistory.model");
const User = require("../models/user.model");
const addMoneyController = {};

addMoneyController.index = async (req, res, next) => {
  try {
    console.log(req.body);

    const {
      addMoneyBank,
      addMoneyAccountNumber,
      addMoneyAmount,
      addMoneyPinNumber,
    } = req.body;

    const findUser = await User.findOne({ _id: req.user.userId });

    if (!findUser) {
      return res
        .status(400)
        .json({ status: "failed", message: "User not found" });
    }

    if (findUser.mobileNumber !== addMoneyAccountNumber.slice(1, 11)) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect User Account Number",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      addMoneyPinNumber,
      findUser.pinNumber
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect Phone or Pin Number",
      });
    }

    const newTransaction = new TransactionHistory({
      userId: findUser._id,
      transactionHistoryBank: `${addMoneyBank} - Cash In`,
      transactionHistoryAccountNumber: addMoneyAccountNumber,
      transactionHistoryAmount: parseFloat(addMoneyAmount),
      transactionType: `Add Money`,
      isActive: true,
    });

    findUser.balance += parseFloat(addMoneyAmount);
    findUser.transactionHistory.push(newTransaction._id);
    // console.log(typeof findUser.balance);
    // console.log(typeof addMoneyAmount);
    await findUser.save();

    await newTransaction.save();

    return res.status(200).json({
      status: "success",
      balance: findUser.balance,
      successMsg: "Successfully Added",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = addMoneyController;
