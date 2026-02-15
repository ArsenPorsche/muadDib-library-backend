const userBookRepo = require("../repositories/userBookRepository");
const bookRepo = require("../repositories/bookRepository");

async function addBook(userId, body) {
  const book = await bookRepo.findById(body.bookId);
  if (!book) return { error: { status: 404, message: "Book not found" } };

  await userBookRepo.create({
    userId,
    bookId: body.bookId,
    rating: body.rating,
    comment: body.comment,
  });
  return { data: { message: "Book added to read list" } };
}

async function getUsersBooks(userId, { rating }) {
    const query = {};
    if (rating) query.rating = rating;

    return userBookRepo.find(userId, query);
}

async function updateUserBook(id, userId, body) {
    const userBook = await userBookRepo.update(id, userId, { 
        rating: body.rating, 
        comment: body.comment 
    });
    if (!userBook) return { error: { status: 404, message: "User book not found" } };
    return { data: { message: "Book updated successfully" } };
}

async function deleteUserBook(id) {
    const userBook = await userBookRepo.remove(id);
    if (!userBook) return { error: { status: 404, message: "User book not found" } };
    return { data: { message: "Book removed from read list" } };
}

module.exports = { addBook, getUsersBooks, updateUserBook, deleteUserBook };