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
      transactionHistoryBank: addMoneyBank,
      transactionHistoryAccountNumber: addMoneyAccountNumber,
      transactionHistoryAmount: parseFloat(addMoneyAmount),
      isActive: true,
    });

    findUser.balance += parseFloat(addMoneyAmount);
    // console.log(typeof findUser.balance);
    // console.log(typeof addMoneyAmount);
    await findUser.save();

    await newTransaction.save();

    return res.json({ status: "success", balance: findUser.balance });
  } catch (error) {
    next(error);
  }
};

module.exports = addMoneyController;
