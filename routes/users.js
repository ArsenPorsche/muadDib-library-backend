const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/", userController.register);
router.post("/login", userController.login);
router.get("/me", auth, userController.getMe);

module.exports = router;
