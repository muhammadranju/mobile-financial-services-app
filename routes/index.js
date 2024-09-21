const router = require("express").Router();

const addMoneyController = require("../controller/addMoney.controller");
const cashOutController = require("../controller/cashOut.controller");
const getBonusSectionController = require("../controller/getBonusSection.controller");
const homeController = require("../controller/home.controller");
const loginController = require("../controller/login.controller");
const payBillSectionController = require("../controller/payBillSection.controller");
const transactionHistorySectionController = require("../controller/transactionHistorySection.controller");
const transferMoneyController = require("../controller/transferMoney.controller");
const authMiddleware = require("../middleware/authMiddleware");
const isLoginMiddleware = require("../middleware/isLogin.middleware");

router.route("/").get(authMiddleware, homeController.index);

router.route("/login").get(loginController.loginGet);
router.route("/login").post(loginController.loginPost);
router.route("/register").get(loginController.registerGet);
router.route("/register").post(loginController.registerPost);

router.route("/logout").get(authMiddleware, loginController.logout);

router.route("/add-money").post(authMiddleware, addMoneyController.index);
router.route("/cash-out").post(authMiddleware, cashOutController.index);
router
  .route("/transfer-money")
  .post(authMiddleware, transferMoneyController.index);
router
  .route("/get-bonus")
  .post(authMiddleware, getBonusSectionController.index);
router.route("/pay-bill").post(authMiddleware, payBillSectionController.index);
router
  .route("/transaction-history")
  .get(authMiddleware, transactionHistorySectionController.index);

module.exports = router;
