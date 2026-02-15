const userService = require("../services/userService");
const { validateLogin } = require("../validators/authValidator");
const { validate } = require("../models/user");

async function register(req, res) {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await userService.register(req.body);
    if (result.error)
      return res.status(result.error.status).send({ message: result.error.message });

    res.status(201).send({ data: result.data, message: result.message });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

async function login(req, res) {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const result = await userService.login(req.body.email, req.body.password);
    if (result.error)
      return res.status(result.error.status).send({ message: result.error.message });

    res.status(200).send({ data: result.data, message: result.message });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

async function getMe(req, res) {
  try {
    const result = await userService.getMe(req.user._id);
    if (result.error)
      return res.status(result.error.status).send({ message: result.error.message });

    res.status(200).send(result.data);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

module.exports = { register, login, getMe };