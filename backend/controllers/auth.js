const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const passport = require("passport");
const nodemailer = require("nodemailer");
const CustomError = require("../errors/index");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require("../utils");



const postSignup = async (req, res) => {
  console.log(req.body, "REQ BODY");
  const { name, email, password, confirmPassword, phoneNum } = req.body;
  if (!name || !email || !password || !confirmPassword || !phoneNum) {
    return res.status(401).json({ msg: "PLEASE ENTER ALL FIELDS" });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // throw new CustomError.BadRequestError("Email already exists");
      return res
        .status(409)
        .json({ msg: "User Already Exist with this Email" });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({ msg: "PASSWORD NOT MATCHED" });
    }

    var hash = await bcrypt.hash(req.body.password, 12);
    var hashedPassword = hash;
    const verificationToken = crypto.randomBytes(40).toString("hex");

    let postalAddress = {
      streetAddress: req.body.streetAddress,
      city: req.body.city,
      countryRegion: req.body.countryRegion,
      zipPostalCode: req.body.zipPostalCode,
    };

    const newUser = new User({
      ...req.body,
      postalAddress,
      password: hashedPassword,
      verificationToken,
    });
    await newUser.save();
    const origin = ` http://localhost:4000`;

    await sendVerificationEmail({
      name: newUser.name,
      email: newUser.email,
      verificationToken: newUser.verificationToken,
      origin,
    });

    res.status(200).json({ msg: "SIGNED UP SUCCESSFULLY", newUser });
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.log(error);
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ msg: "PLEASE FILL ALL REQUIRED FIELDS" });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: "NO USER EXIST WITH THIS EMAIL" });
  }
  let match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ msg: "INCORRECT PASSWORD" });
  }
  const userid = user._id;
  const token = jwt.sign({ userid, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.status(200).json({ msg: "LOGGED IN SUCCESSFULLY", token, user });
};

// const postLogin = async (req, res) => {
//   passport.authenticate("local", {
//     isLoggedIn: "true",
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   });
// };

const verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }

  if (user.verificationToken !== token) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }

  (user.isVerified = true), (user.verified = Date.now());

  user.verificationToken = "";
  await user.save();

  res
    .status(200)
    .redirect(`http://localhost:3000/login?msg='EMAIL VERIFIED SUCCESSFULLY'`);
};

const forgotPassword = async (req, res) => {
  // let successMessage = req.flash("success");

  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }
  // let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("forgotPassword", {
    successMessage: successMessage,
    errorMessage: errorMessage,

    oldInput: {
      email: "",
    },
  });
};

const sendResetPasswordLink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "NO USER FOUND WITH THIS EMAIL" });
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    const origin = "http://localhost:4000";
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
    //////////////////////////////////////////////////////////////////////////////////////////////
    // req.flash("success", "CHECK YOUR EMAIL FOR RESET PASSWORD LINK");
    res.status(200).json({ msg: "CHECK YOUR EMAIL FOR RESET PASSWORD LINK" });
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
    console.log(message, "MMMMMMMMSSSSSSSGGGGGGGGG");
  } else {
    message = null;
  }

  lastPageUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  console.log(lastPageUrl, "FULL URLLL");

  const { token, email } = req.query;
  if (!token || !email) {
    // throw new CustomError.BadRequestError("Please provide all values");
    console.log("PLEASE PROVIDE ALL VALUES");
    return;
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      res.redirect(`http://localhost:3000/resetPassword?email=${email}`);
    }
  }
};

const setNewPassword = async (req, res) => {
  const { password, confirmPassword, email } = req.body;
  if (!password || !email) {
    return res.status(500).json({ msg: "PLEASE FILL ALL REQUIRED FIELDS" });
  }
  if (password !== confirmPassword) {
    return res.status(500).json({ msg: "PASSWORD NOT MATCHED" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "NO USER EXIST WITH THIS EMAIL" });
    }
    var hash = await bcrypt.hash(req.body.password, 12);
    user.password = hash;
    user.passwordToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();
    res.status(200).json({ msg: "PASSWORD UPDATED SUCCESSFULLY" });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  console.log("USER LOGGED OUT");
  res.status(200).json({ msg: "LOGGED OUT SUCCESSFULLY" });
};

const getUser = async (req, res) => {
  email = "m.abdullah.idenbrid@gmail.com";
  const user = await User.findOne({ email });
  console.log(user, "USSSSSSSEEEEERRRRRR");
};

module.exports = {
  postSignup,
  postLogin,
  verifyEmail,
  forgotPassword,
  sendResetPasswordLink,
  resetPassword,
  setNewPassword,
  logout,
  getUser,
};
