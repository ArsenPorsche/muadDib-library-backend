const mongoose = require("mongoose");
const Joi = require("joi");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true, sparse: true },
  publishedYear: { type: Number },
  genre: { type: String },
  description: { type: String },
  coverImage: { type: String },
});

const Book = mongoose.model("Book", bookSchema);

const validateBook = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).required().label("Title"),
    author: Joi.string().min(1).required().label("Author"),
    isbn: Joi.string().allow("").label("ISBN"), 
    publishedYear: Joi.number().integer().min(0).label("Published Year"),
    genre: Joi.string().label("Genre"),
    description: Joi.string().label("Description"),
    coverImage: Joi.string().uri().allow("").label("Cover Image"),
  });
  return schema.validate(data);
};

module.exports = { Book, validateBook };