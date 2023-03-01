const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const { check, body } = require("express-validator");
const passport = require("passport");

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "./login",
//     successRedirect: "/",
//     successFlash: true,
//     failureFlash: true,
//     successFlash: "Succesfu1!",
//     failureFlash: "Invalid Email or Password.",
//   })
//   );
router.route("/post-signup").post(
  check("email").isEmail().withMessage("Please enter Valid Email Address"),
  body("password", "Please Enter password which is atleast 5 Characters long")
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords have to match");
    }
    return true;
  }),
  auth.postSignup
);
router.route("/post-login").post(auth.postLogin);
router.route("/verifyEmail").get(auth.verifyEmail);
router.route("/forgotPassword").get(auth.forgotPassword);
router.route("/sendResetPasswordLink").post(auth.sendResetPasswordLink);
router.route("/resetPassword").get(auth.resetPassword);
router.route("/setNewPassword").post(auth.setNewPassword);
router.route("/getUser").get(auth.getUser);
router.route("/logout").get(auth.logout);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    res.redirect("/");
  }
);
module.exports = router;
