const userBookService = require("../services/userBookService");
const { validateUserBook, validateUserBookUpdate } = require("../models/userBook");

async function create(req, res) {
    try {
        const { error } = validateUserBook(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const result = await userBookService.addBook(req.user._id, req.body);
        if (result.error) 
            return res.status(result.error.status).json(result.error);

        return res.status(201).send(result.data );
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }

}

async function list(req, res) {
    try {
        const userBooks = await userBookService.getUsersBooks(req.user._id, req.query);
        res.status(200).send(userBooks);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

async function update(req, res) {
    try {
        const { error } = validateUserBookUpdate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const result = await userBookService.updateUserBook(req.params.id, req.user._id, req.body);
        if (result.error)
            return res.status(result.error.status).json(result.error);

        return res.status(200).send(result.data);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

async function remove(req, res) {
    try {
        const result = await userBookService.deleteUserBook(req.params.id);
        if (result.error)
            return res.status(result.error.status).json(result.error);

        return res.status(200).send();
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { create, list, update, remove };