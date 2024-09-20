const getBonusSectionController = {};

getBonusSectionController.index = async (req, res, next) => {
  try {
    console.log(req.body);
    res.json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

module.exports = getBonusSectionController;
