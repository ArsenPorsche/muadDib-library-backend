const { UserBook } = require("../models/userBook");

    async function create(data) {
        return new UserBook(data).save();
    }

    async function find(userId, query) {
        return UserBook.find({ userId, ...query }).populate("bookId");
    }

    async function update(id, userId, data) {
        return UserBook.findOneAndUpdate({ _id: id, userId }, data, { new: true });
    }

    async function remove(id) {
        return UserBook.findByIdAndDelete(id);
    }

module.exports = { create, find, update, remove };
