const bookRepo = require("../repositories/bookRepository");

async function listBooks({ page = 1, limit = 21, search, genre }) {
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
  const skip = (page - 1) * limit;
  return bookRepo.find(query, { skip, limit: parseInt(limit) });
}

module.exports = { listBooks };