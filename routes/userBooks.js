const router = require("express").Router();
const auth = require("../middleware/auth");
const userBookController = require("../controllers/userBookController");

router.post("/", auth, userBookController.create);
router.get("/", auth, userBookController.list);
router.put("/:id", auth, userBookController.update);
router.delete("/:id", auth, userBookController.remove);

 
module.exports = router;
