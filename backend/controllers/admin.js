const Product = require("../models/product");
const User = require("../models/user");

const path = require("path");

const dashboard = async (req, res) => {
  // let errorMessage = req.flash("error");
  console.log(errorMessage, "EEEEEEEEEEEEEEEEEEEEEEEE");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  // let successMessage = req.flash("success");
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }
  try {
    const totalProducts = await Product.countDocuments({});
    const noOfUsers = await User.countDocuments({});
    const electronicProducts = await Product.countDocuments({
      category: "Electronics",
    });
    const crockeryProducts = await Product.countDocuments({
      category: "Corckery",
    });
    const shoesProducts = await Product.countDocuments({ category: "Shoes" });
    const otherProducts = await Product.countDocuments({ category: "Other" });
    res.render("adminDashboard", {
      totalProducts,
      noOfUsers,
      electronicProducts,
      crockeryProducts,
      shoesProducts,
      otherProducts,
      errorMessage,
      successMessage,
    });
    // res.status(200).json({ totalProducts, noOfUsers,electronicProducts, crockeryProducts,shoesProducts,otherProducts });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const allProducts = async (req, res, next) => {
  // let isAuthenticated = false
  // if(req.user){
  //    isAuthenticated = true
  // }
  const { name } = req.query;
  const { category } = req.query;
  const { page } = req.query;
  console.log(page);

  const queryObject = {};
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (category) {
    queryObject.category = category;
  }

  if (req.user) {
    var username = req.user.name;
  }

  try {
    let products = Product.find(queryObject);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    products = await products.skip(skip).limit(limit);

    res.render("./admin/all-products", {
      // isAuthenticated,
      prods: products,
      pageTitle: "Shop",
      Authenticate: true,
      name: username,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/auth/login");
  }
};

const getProduct = async (req, res) => {
  const { id: prodID } = req.params;
  const product = await Product.findOne({ _id: prodID });
  if (!product) {
    res.status(200).json({ message: "Product not found" });
  }
  res.status(200).json({ product });
  console.log("Product Found");
  console.log(product);
};

const deleteProduct = async (req, res) => {
  console.log("Delete product called");
  const { id: prodID } = req.params;
  const product = await Product.findByIdAndRemove({ _id: prodID });
  if (!product) {
    console.log("error not found");
  }
  console.log("Product Removed");

  // res.status(200).json({ message: "Product Removed" });
};

const AddProduct = async (req, res) => {
  // let csrf = req.csrfToken();
  //   csrf = res.locals.csrfToken
  // console.log(csrf)
  console.log(res.Product);
  res.render("./admin/add-product");
};

const postAddProduct = async (req, res) => {
  const image = req.file;
  const imageUrl = image.filename;
  // const imageUrl = image.path; CHANGED

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    imageUrl: imageUrl,
    category: req.body.category,
    // imageUrl: imageUrl,
  });
  try {
    await product.save();
    console.log("Product Created");
    console.log(product);
    res.redirect("./add-product");
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req, res) => {
  const {
    body: { name, price },
    params: { id: prodID },
  } = req;

  if (name === "" || price === "") {
    console.log("Fields cannot be empty");
  }
  const product = await Product.findByIdAndUpdate({ _id: prodID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    console.log(`No Product with id ${Id}`);
  }
  res.status(200).json({ product });
};

module.exports = {
  dashboard,
  AddProduct,
  postAddProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  allProducts,
};
