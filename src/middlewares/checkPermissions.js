const User = require("../models/user");

exports.checkPermission = async (req, res, next) => {
  const id = req.user._id;
  const user = await User.findById(id);
  try {
    if (user.role !== "admin") {
      return res
        .status(401)
        .json({ success: false, error: "You don't have permission" });
    }
  } catch (error) {
    console.log(error);
  }

  next();
};
