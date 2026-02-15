const bookService = require("../services/bookService");

async function list(req, res) {
  try {
    const books = await bookService.listBooks(req.query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { list };