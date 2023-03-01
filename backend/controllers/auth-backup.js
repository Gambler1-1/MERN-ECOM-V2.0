const path = require(`path`)
const bcrypt = require('bcryptjs')
const User = require("../models/user")
const session = require('express-session')
const { validationResult } = require('express-validator')
const user = require('../models/user')
const passport = require('passport')
const nodemailer = require('nodemailer')


login = (req, res) => {
  res.render('login')
}
postLogin = async (req, res) => {

  passport.authenticate('local', {
    isLoggedIn:'true',
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
  }

signup = (req, res) => {
  // let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null;
  }
  res.render('signup', {
    errorMessage: message,
    oldInput: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNum: ''
    }
  })

}

postSignup = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('signup', {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        phoneNum: req.body.phoneNum
      }
    })
  }

  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        var hash = await bcrypt.hash(req.body.password, 12)
        var hashedPassword = hash
      
   
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phoneNum: req.body.phoneNum
      });
      const newUser = await user.save();
      
      console.log('User Signed Up')
      console.log(newUser);

      const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'m.abdullah.idenbrid@gmail.com',
            pass: process.env.MAIL_PASS,
        }
    })
    const options={
        from:'m.abdullah.idenbrid@gmail.com',
        to: user.email,
        subject:'E-COM WEB',
        text:`Thank You ${user.name} for Signing Up. 
        Click on  link to verify your email`
    };
    
    transporter.sendMail(options, function(err,info){
        if(err){
            console.log(err);
            return;
        }
        console.log("SENT: " + info.response);
    })

      res.redirect('./login')
    }
  
    if (user) {
      req.flash('error', 'User Already Exist with this Email.')
      console.log('User Already Exist with this Email')
      res.redirect('./signup')
    }
    
  } catch (error) {
    console.log(error.msg);
  }
  // const user = await User.findOne({ email: req.body.email })
  // if (!user) {

  //   try {
  //     var hash = await bcrypt.hash(req.body.password, 12)
  //     var hashedPassword = hash
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }
  //   const user = new User({
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: hashedPassword,
  //     phoneNum: req.body.phoneNum
  //   });
  //   user.save();
  //   console.log('User Signed Up')
  //   res.redirect('./login')
  // }

  // if (user) {
  //   req.flash('error', 'User Already Exist with this Email.')
  //   console.log('User Already Exist with this Email')
  //   res.redirect('./signup')
  // }
}


logout = (req, res) => {
  req.session.destroy();
  console.log("USER LOGGED OUT")
  res.redirect('/');
}

module.exports = {
  login,
  logout,
  signup,
  postSignup,
}
