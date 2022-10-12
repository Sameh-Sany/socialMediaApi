const router = require("express").Router();
const {
  store,
  index,
  show,
  update,
  destroy,
} = require("../controllers/usersController");

router.get("/", index);
router.get("/:id", show);
router.post("/", store);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
