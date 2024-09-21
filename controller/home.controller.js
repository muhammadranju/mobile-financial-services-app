const User = require("../models/user.model");
const { format } = require("date-fns");

const homeController = {};

homeController.index = async (req, res, next) => {
  try {
    // Find the user and populate their transactionHistory with sorting and limiting
    const user = await User.findOne({ _id: req.user.userId }).populate({
      path: "transactionHistory",
      options: {
        sort: { createdAt: -1 }, // Sort by 'createdAt' in descending order
        limit: 5, // Limit to 5 transactions
      },
    });

    // Format the transactionHistory's createdAt and updatedAt fields
    const formattedTransactionHistory = user.transactionHistory.map(
      (transaction) => ({
        ...transaction._doc, // Extract the original document data
        createdAt: format(transaction.createdAt, "dd-MM-yyyy HH:mm:ss"), // Format createdAt
        updatedAt: format(transaction.updatedAt, "dd-MM-yyyy HH:mm:ss"), // Format updatedAt
      })
    );
    return res.status(200).render("index", {
      user,
      transactionHistory: formattedTransactionHistory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = homeController;
