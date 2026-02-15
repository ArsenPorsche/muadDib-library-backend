const mongoose = require("mongoose");
const Joi = require("joi");

const userBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  readDate: { type: Date, default: Date.now },
});

const UserBook = mongoose.model("UserBook", userBookSchema);

const validateUserBook = (data) => {
  const schema = Joi.object({
    bookId: Joi.string().required().label("Book ID"),
    rating: Joi.number().integer().min(1).max(5).label("Rating"),
    comment: Joi.string().allow("").label("Comment"),
  });
  return schema.validate(data);
};

function validateUserBookUpdate(data) {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow("").optional(),
  });
  return schema.validate(data);
}

module.exports = { UserBook, validateUserBook, validateUserBookUpdate };
