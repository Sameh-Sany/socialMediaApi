const mongoose = require("mongoose");
const expressValidator = require("express-validator");
const User = require("../models/user");

// Create a new user
exports.store = async (req, res) => {
  try {
    //validate the request body first
    if (!req.body) {
      return res.status(400).send({ message: "User content can not be empty" });
    }
    //handle validation errors
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ message: "Validation failed", errors: errors.array() });
    }

    // Create a new user
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Retrieve all users
exports.index = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Retrieve a single user with userId
exports.show = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found with id " + userId });
    }
    res.send(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .send({ message: "User not found with id " + userId });
    }
    return res
      .status(500)
      .send({ message: "Error retrieving user with id " + userId });
  }
};

// Update a user with userId
exports.update = async (req, res) => {
  const userId = req.params.userId;
  try {
    //validate the request body first
    if (!req.body) {
      return res.status(400).send({ message: "User content can not be empty" });
    }
    //handle validation errors
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ message: "Validation failed", errors: errors.array() });
    }

    // Find user and update it with the request body
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found with id " + userId });
    }
    res.send(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .send({ message: "User not found with id " + userId });
    }
    return res
      .status(500)
      .send({ message: "Error updating user with id " + userId });
  }
};

// Delete a user with userId
exports.destroy = async (req, res) => {
  //handle validation errors
  const errors = expressValidator.validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send({ message: "Validation failed", errors: errors.array() });
  }

  const userId = req.params.userId;
  try {
    const user = await User.findByIdAndRemove(userId);
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found with id " + userId });
    }
    res.send({ message: "User deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId" || error.name === "NotFound") {
      return res
        .status(404)
        .send({ message: "User not found with id " + userId });
    }
    return res
      .status(500)
      .send({ message: "Could not delete user with id " + userId });
  }
};
