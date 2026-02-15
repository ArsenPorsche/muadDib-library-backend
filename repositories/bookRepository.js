const { Book } = require("../models/book");

async function find(query, { skip, limit }) {
  return Book.find(query).skip(skip).limit(limit);
}

async function findById(id) {
  return Book.findById(id);
}

module.exports = { find, findById };