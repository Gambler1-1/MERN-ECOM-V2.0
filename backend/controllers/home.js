const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

const getIndex = async (req, res) => {
  console.log(req.query, "REQ QUERYYYYYYYYYYYYY");
  const { name } = req.query;
  const { category } = req.query;
  const queryObject = {};

  if (name || name !== "") {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (category || category !== "") {
    queryObject.category = category;
  }
  console.log(queryObject, "QRY OBJ");
  try {
    let products = Product.find(queryObject);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    products = await products.skip(skip).limit(limit);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
};

const getCart = async (req, res) => {
  // console.log("GET CART CALLED");
  const userId = req.query.userId;
  // console.log(userId, "USER ID");
  try {
    let cart = await Cart.findOne({ user: userId, orderPlaced: false })
      .populate("user", "name , email")
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "Product",
        },
      });
    // console.log(cart,"CAAAAAAAAAAART");
    if (!cart) {
      return res.status(404).json({ msg: "No items in Cart" });
    }

    let cartId = cart._id;
    let cartItems = cart.items;
    let totalPrice = 0;
    for (let i = 0; i < cartItems.length; i++) {
      totalPrice += cartItems[i].product.price * cartItems[i].quantity;
    }
    let itemsCount = cartItems.length;
    res
      .status(200)
      .json({ msg: "CART", cartId, cartItems, itemsCount, totalPrice });
  
  } catch (error) {
    console.error(error);
    res.status(200).json({ msg: "REDIRECT LOGIN" });
  }
};

const addToCart = async (req, res) => {
  
  // console.log(req.query,"REQ QUERY");
  var product = req.query.id;
  const userId = req.query.userId
  if(userId ==='null'){
    return res.status(401).json({msg:'UNAUTHORIZED : SIGN IN FIRST'})
  }

  try {
    const oldCart = await Cart.findOne({ user: userId, orderPlaced: false });
    // if (oldCart.orderPlaced) {
    //   console.log(oldCart.orderPlaced, "STATUS");
    // }
    // if(oldCart || !oldCart.orderPlaced){
    //   console.log("ORDER PLACED");
    // }
    if (oldCart) {
      let found = false;
      console.log("CART FOUND");
      const oldItems = oldCart.items;

      for (let i = 0; i < oldItems.length; i++) {
        if (oldItems[i].product._id == product) {
          console.log("product found");
          found = true;
          console.log(`Old Qty: ${oldItems[i].quantity}`);
          newQty = oldItems[i].quantity + 1;
          oldItems[i].quantity = newQty;
          console.log(`New Qty: ${oldItems[i].quantity}`);
          await oldCart.save();
          res.status(200).json({msg:'PRODUCT QTY UPDATED IN CART'})
          break;
        }
      }
      if (!found) {
        console.log("Product is not in Cart... Adding it Now....");
        const newitem = {
          product,
        };
        oldCart.items.push(newitem);
        const updatedList = await oldCart.save();
        console.log("Product Added in Cart");
        return res.status(200).json({msg:'A NEW PRODUCT IS ADDED IN CART'});

        
      }
    } else {
      const cart = new Cart({
        user: userId,
        items: [
          {
            product,
          },
        ],
      });
      await cart.save();
      console.log(cart._id, "Cart Created");
      res.redirect(lastPageUrl);
    }
  } catch (error) {
    console.log(error);
  }
};

const removeFromCart = async (req, res) => {
  console.log(req.params, "REQ PARAMS");
  if (req.params.id === "undefiend") {
    return res.status(400).json({ msg: "ID UNDEFINED" });
  }
  var product = req.params.id;
  const userId = req.session.passport.user._id;
  try {
    const oldCart = await Cart.findOne({ user: userId });
    if (oldCart) {
      let found = false;
      console.log("CART FOUND");
      const oldItems = oldCart.items;

      for (let i = 0; i < oldItems.length; i++) {
        if (oldItems[i].product._id == product) {
          console.log("product found");
          found = true;
          console.log(`Old Qty: ${oldItems[i].quantity}`);
          newQty = oldItems[i].quantity - 1;
          oldItems[i].quantity = newQty;
          console.log(`New Qty: ${oldItems[i].quantity}`);
          await oldCart.save();
          res.redirect("/cart");
          break;
        }
      }
      if (!found) {
        console.log("Product is not in Cart... Adding it Now....");
        const newitem = {
          product,
        };
        oldCart.items.push(newitem);
        const updatedList = await oldCart.save();
        console.log("Product Added in Cart");
        return res.redirect(lastPageUrl);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const viewProduct = async (req, res) => {
  const { id: prodID } = req.params;
  const product = await Product.findOne({ _id: prodID });
  if (!product) {
    res.status(200).json({ message: "Product not found" });
  }
  res.status(200).json({ product });
  console.log("Product Found");
};

const placeOrder = async (req, res) => {
  const userId = req.session.passport.user._id;
  const { id: cartId, totalPrice } = req.query;
  if (!cartId) {
    res.status(500).json({ msg: "ERROR" });
  }
  try {
    const orderPlaced = await Cart.findOne({ _id: cartId, orderPlaced: true });
    if (orderPlaced) {
      return res
        .status(400)
        .json({ msg: "ORDER ALREADY PLACED WITH THIS CART" });
    }
    const order = new Order({
      user: userId,
      cart: cartId,
      totalPrice,
    });
    await order.save();
    const cart = await Cart.findById({ _id: cartId });
    cart.orderPlaced = true;
    await cart.save();
    // req.flash("success", `ORDER PLACED SUCCESSFULLY Order ID : ${order._id}`);
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const userOrders = async (req, res) => {
  const { id: userId } = req.params;
  // let successMessage = req.flash("success");
  console.log(successMessage, "SUCCESS MSG");
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }
  try {
    const orders = await Order.find({ user: userId })
      .populate("cart")
      .populate({
        path: "cart",
        populate: {
          path: "user",
          model: "User",
          select: "name email",
        },
      })
      .populate({
        path: "cart",
        populate: {
          path: "items.product",
          model: "Product",
          select: "name price imageUrl",
        },
      });
    console.log(orders[0].cart.items[0], "CAAAAAAAAAA");

    // .populate({
    //   path: "cart",
    //   populate: {
    //     path: "user",
    //     model: "User",
    //   },
    // }).populate({
    //   path: 'cart.product',
    //   select:
    //     'name price',
    // });

    if (!orders) {
      return res.status(404).json({ msg: "NO ORDERS FOUND" });
    }
    res.render("myOrders", {
      orders: orders,
      pageTitle: "Your Orders",
      successMessage,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  viewProduct,
  getIndex,
  getCart,
  addToCart,
  removeFromCart,
  placeOrder,
  userOrders,
};
