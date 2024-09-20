const TransactionHistory = require("../models/transactionHistory.model");
const User = require("../models/user.model");
const { format } = require("date-fns");

const homeController = {};

homeController.index = async (req, res, next) => {
  const user = req.user;
  try {
    const transactionHistory = await TransactionHistory.find({
      isActive: true,
    }).sort({ createdAt: -1 });
    const formattedTransactionHistory = transactionHistory.map(
      (transaction) => ({
        ...transaction._doc, // Get the original document data
        createdAt: format(transaction.createdAt, "dd-MM-yyyy HH:mm:ss"), // Format createdAt
        updatedAt: format(transaction.updatedAt, "dd-MM-yyyy HH:mm:ss"), // Format updatedAt
      })
    );
    console.log(formattedTransactionHistory);
    const user = await User.findOne({ _id: req.user.userId });
    return res.render("index", {
      user,
      transactionHistory: formattedTransactionHistory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = homeController;
