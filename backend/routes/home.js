const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");

const { getIndex, getCart, addToCart, removeFromCart, placeOrder, userOrders  } = require("../controllers/home");

router.route("/").get(getIndex);
router.route("/cart").get(getCart);
router.route("/addToCart").get(addToCart);
router.route("/removeFromCart/:id").get(isAuth,removeFromCart);
router.route("/placeOrder").get(isAuth,placeOrder);
router.route("/myOrders/:id").get(isAuth,userOrders);






module.exports = router;
