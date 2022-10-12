const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const pathToKey = path.join(__dirname, "..", "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");
const responseSuccess = require("../helpers/responses/success");
const InternalError = require("../helpers/errors/InternalError");
const ResourceAlreadyExistError = require("../helpers/errors/ResourceAlreadyExistError");
const ValidationError = require("../helpers/errors/ValidationError");
const InvalidCredentialError = require("../helpers/errors/InvalidCredentialError");

//login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }
  }
  const emailLowerCase = email.trim().toLowerCase();
  try {
    const user = await User.findOne({
      $or: [{ email: emailLowerCase }],
    });
    if (!user) return next(new InvalidCredentialError());
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) return next(new InvalidCredentialError());
    const _id = user._id;
    const expiresIn = "7d";
    const payload = {
      sub: _id,
      iat: Date.now(),
    };
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
      expiresIn: expiresIn,
      algorithm: "RS256",
    });
    delete user?._doc.password;
    return res.json(
      responseSuccess({
        user,
        token: "Bearer " + signedToken,
      })
    );
  } catch (error) {
    console.log("Unauthorized attemp");
    return next(new InternalError(error));
  }
};

//register
exports.register = async (req, res, next) => {
  let {
    userName,
    email,
    profilePicture,
    password,
    coverPicture,
    followers,
    followings,
    isAdmin,
  } = req.body;
  // Handle validtaion Errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError(errors.array()));
  }
  try {
    // Check if user exist
    const userExist = await User.findOne({ email });
    if (userExist) return next(new ResourceAlreadyExistError("User", email));
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      profilePicture,
      password: encryptedPassword,
      coverPicture,
      followers,
      followings,
      isAdmin,
    });

    const _id = user._id;
    const expiresIn = "7d";
    const payload = {
      sub: _id,
      iat: Date.now(),
    };
    //   Generate token
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
      expiresIn: expiresIn,
      algorithm: "RS256",
    });

    delete user?._doc.password;
    return res.json(
      responseSuccess({
        user,
        token: "Bearer " + signedToken,
      })
    );
  } catch (error) {
    console.log(error);
    return next(new InternalError(errors.array()));
  }
};

//forgot password
// exports.forgotPassword = async (req, res, next) => {
//   const { email } = req.body;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(new ValidationError(errors.array()));
//   }
//   try {
//     const user = await User.findOne({ $or: [{ email }, { phone: email }] });
//     if (!user) return next(new InvalidCredentialError());
//     const verificationCode = 2222;
//     user.verificationCode = verificationCode;
//     await user.save();
//     const body = {
//       subject: "verification Code ", // Subject line
//       text: "verification Code", // plain text body
//       html: "<b> verificationCode:</b>" + verificationCode, // html body
//     };
//     sendMailer(email, body);
//     return res.json(responseSuccess({ message: "verification code sent" }));
//   } catch (error) {
//     console.log(error);
//     return next(new InternalError(error));
//   }
// };

// //my profile
// exports.myProfile = async (req, res, next) => {
//   const id = req.user._id;
//   try {
//     const user = await User.findById(id);
//     if (!user) return next(new InvalidCredentialError());
//     delete user?._doc.password;
//     return res.json(responseSuccess({ user }));
//   } catch (error) {
//     console.log(error);
//     return next(new InternalError(error));
//   }
// };

// //update profile
// exports.updateProfile = async (req, res, next) => {
//   const id = req.user._id;
//   const { firstName, lastName, email, phone } = req.body;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(new ValidationError(errors.array()));
//   }
//   try {
//     const user = await User.findById(id);
//     if (!user) return next(new InvalidCredentialError());
//     user.firstName = firstName;
//     user.lastName = lastName;
//     user.email = email;
//     user.phone = phone;
//     await user.save();
//     delete user?._doc.password;
//     return res.json(responseSuccess({ user }));
//   } catch (error) {
//     console.log(error);
//     return next(new InternalError(error));
//   }
// };

// //verify code
// exports.verifyRegisterOTP = async (req, res, next) => {
//   const { email, verificationCode } = req.body;

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(new ValidationError(errors.array()));
//   }
//   try {
//     const user = await User.findOne({ $or: [{ email }, { phone: email }] });
//     if (!user) return next(new InvalidCredentialError());
//     if (user.verificationCode !== verificationCode) {
//       return next(new InvalidCredentialError());
//     }
//     user.isVerified = true;
//     await user.save();
//     delete user?._doc.password;
//     return res.json(responseSuccess({ message: "user verified", user }));
//   } catch (error) {
//     console.log(error);
//     return next(new InternalError(error));
//   }
// };

// //resend otp
// exports.resendOTP = async (req, res, next) => {
//   const { email } = req.body;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(new ValidationError(errors.array()));
//   }
//   try {
//     const user = await User.findOne({ $or: [{ email }, { phone: email }] });
//     if (!user) return next(new InvalidCredentialError());
//     const verificationCode = 2222;
//     user.verificationCode = verificationCode;
//     await user.save();
//     const body = {
//       subject: "verification Code ", // Subject line
//       text: "verification Code", // plain text body
//       html: "<b> verificationCode:</b>" + verificationCode, // html body
//     };
//     sendMailer(email, body);
//     return res.json(
//       responseSuccess({
//         verificationCode: user.verificationCode,
//         message: "verification code sent",
//       })
//     );
//   } catch (error) {
//     console.log(error);
//     return next(new InternalError(error));
//   }
// };
