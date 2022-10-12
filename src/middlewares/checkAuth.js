const passport = require("passport");

const UnauthorizedError = require("../helpers/errors/UnauthorizedError");

exports.hasValidJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error) {
      console.log("Unauthorized attemp");
      return next(new UnauthorizedError());
    }

    if (info) {
      console.log("Unauthorized attemp");
      return next(new UnauthorizedError());
    }

    if (!user) return next(new UnauthorizedError());

    req.user = user;
    next();
  })(req, res, next);
};
