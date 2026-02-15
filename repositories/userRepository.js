const { User } = require("../models/user");

async function create(userData) {
  const user = new User(userData);
  return user.save();
}

async function findByEmail(email) {
  return User.findOne({ email });
}

async function findById(id) {
  return User.findById(id).select("-password");
}

module.exports = { create, findByEmail, findById };