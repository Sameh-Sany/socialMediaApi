const express = require("express");
const User = require("../models/user");
const { body } = require("express-validator");
const { hasValidJwt } = require("../middlewares/checkAuth");

const {
  login,
  register,
  forgotPassword,
  myProfile,
  updateProfile,
  resendOTP,
  verifyRegisterOTP,
} = require("../controllers/authController");

const router = express.Router();
// auth routes for login and register users

router.post(
  "/login",
  [
    body("email").not().isEmpty().withMessage("email is Required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be more than 6 Characters"),
  ],
  login
);

router.post(
  "/register",
  [body("userName").notEmpty().withMessage("User userName is required")],
  [body("email").notEmpty().withMessage("User email is required")],

  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom((value) => {
        return User.find({
          email: value,
        }).then((user) => {
          if (user.length > 0) throw "user is taken!"; //custom error message
        });
      })
      .withMessage("user  is exist  arleady."),
  ],
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be more than 6 Characters"),
  ],

  register
);

module.exports = router;
