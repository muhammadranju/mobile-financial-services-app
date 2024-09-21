const User = require("../models/user.model");
const { format } = require("date-fns");

const homeController = {};

homeController.index = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ _id: req.user.userId }).populate({
      path: "transactionHistory",
      options: {
        sort: { createdAt: -1 },
        limit: limit,
        skip: skip,
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

    const totalTransactions = await User.aggregate([
      { $match: { _id: req.user.userId } },
      { $unwind: "$transactionHistory" },
      { $count: "total" },
    ]);

    const totalTransactionCount = totalTransactions.length
      ? totalTransactions[0].total
      : 0;
    const totalPages = Math.ceil(totalTransactionCount / limit);

    return res.status(200).render("index", {
      user,
      transactionHistory: formattedTransactionHistory,
      totalPages,
      page,
      limit,
      title: "Home - Payooo",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = homeController;
