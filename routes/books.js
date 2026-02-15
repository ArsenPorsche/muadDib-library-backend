const express = require("express");
const { Book } = require("../models/book");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 21, search, genre } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (genre) {
      query.genre = { $regex: genre, $options: "i" };
    }

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;