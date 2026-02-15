const router = require("express").Router();
require("dotenv").config();
const {
  UserBook,
  validateUserBook,
  validateUserBookUpdate,
} = require("../models/userBook");
const { Book } = require("../models/book");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { error } = validateUserBook(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const book = await Book.findById(req.body.bookId);
    if (!book) return res.status(404).send({ message: "Book not found" });

    const userBook = new UserBook({
      userId: req.user._id,
      bookId: req.body.bookId,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    await userBook.save();
    res.status(201).send({ message: "Book added to read list" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", auth, async (req, res) => {
  const { rating } = req.query;
  const query = {};

  if (rating) {
    query.rating = parseInt(rating);  
  }

  try {
    const userBooks = await UserBook.find({ userId: req.user._id, ...query }).populate(
      "bookId"
    );
    res.status(200).send(userBooks);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validateUserBookUpdate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userBook = await UserBook.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        rating: req.body.rating,
        comment: req.body.comment,
      },
      { new: true }
    );
    if (!userBook)
      return res.status(404).send({ message: "User book not found" });
    res.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const userBook = await UserBook.findOneAndDelete({
      _id: req.params.id,
    });
    if (!userBook)
      return res.status(404).send({ message: "User book not found" });
    res.status(200).send({ message: "Book removed from read list" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
