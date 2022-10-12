const mongoose = require("mongoose");

exports.connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sameh:01142563405@cluster0.sgnux.mongodb.net/social",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
