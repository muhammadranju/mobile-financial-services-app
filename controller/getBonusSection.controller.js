const TransactionHistory = require("../models/transactionHistory.model");
const User = require("../models/user.model");

const getBonusSectionController = {};

getBonusSectionController.index = async (req, res, next) => {
  try {
    console.log(req.body);
    const { getBonusCoupon } = req.body;

    const user = await User.findOne({ _id: req.user.userId });

    const getBonusCouponText = "50TK";

    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "User not found" });
    }

    const newTransaction = new TransactionHistory({
      userId: user._id,
      transactionHistoryBank: `Get Bonus`,
      transactionHistoryAccountNumber: user.mobileNumber,
      transactionHistoryAmount: parseFloat(getBonusCoupon),
      transactionType: `Get Bonus`,
      isActive: true,
    });
    if (getBonusCouponText === "50TK") {
      user.balance += 50;
    }
    user.transactionHistory.push(newTransaction._id);

    await user.save();
    await newTransaction.save();

    return res.status(200).json({
      status: "success",
      balance: user.balance,
      successMsg: "Successfully Got Bonus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getBonusSectionController;
