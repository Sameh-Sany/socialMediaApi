const jwt = require("jsonwebtoken");

exports.decodeToken = (token) => {
  if (!token) return;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return decoded;
  } catch (error) {
    // console.log(error);
    return null;
  }
};
