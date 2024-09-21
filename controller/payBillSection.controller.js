const bcrypt = require("bcryptjs");
const TransactionHistory = require("../models/transactionHistory.model");
const User = require("../models/user.model");

const payBillSectionController = {};

payBillSectionController.index = async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      payBillSelectToPay,
      payBillBankAccountNumber,
      payBillAmountToAdd,
      payBillPinNumber,
    } = req.body;

    const user = await User.findOne({ _id: req.user.userId });

    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "User not found" });
    }

    if (user.balance < parseFloat(payBillAmountToAdd)) {
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

    if (user.mobileNumber !== payBillBankAccountNumber.slice(1, 11)) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect User Account Number",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      payBillPinNumber,
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
      transactionHistoryBank: `${payBillSelectToPay} - Pay Bill`,
      transactionHistoryAccountNumber: payBillBankAccountNumber,
      transactionHistoryAmount: parseFloat(payBillAmountToAdd),
      transactionType: `Pay Bill`,
      isActive: true,
    });

    user.transactionHistory.push(newTransaction._id);
    user.balance -= parseFloat(payBillAmountToAdd);

    await user.save();
    await newTransaction.save();

    return res.status(200).json({
      status: "success",
      balance: user.balance,
      successMsg: "Successfully Paid Bill",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = payBillSectionController;
