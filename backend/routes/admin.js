const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/isAdmin");

const admin = require("../controllers/admin");
const {
  AddProduct,
  postAddProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  allProducts,
  dashboard,
} = require("../controllers/admin");

// router.route('/add-product').get(isAuth,AddProduct)
router.route("/").get(isAdmin, allProducts);

router.route("/dashboard").get(isAdmin, dashboard);

router.route("/add-product").get(isAdmin, AddProduct);

router.route("/postAddProduct").post(isAdmin, postAddProduct);

router
  .route("/product/:id")
  .get(getProduct)
  .delete(deleteProduct)
  .patch(updateProduct);

router.route("/deleteProduct/:id").delete(deleteProduct);

module.exports = router;
