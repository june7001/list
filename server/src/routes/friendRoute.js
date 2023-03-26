const express = require("express");
const friendController = require("../controllers/friendController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/addFriend", authMiddleware, friendController.addFriend);
router.get("/friends", authMiddleware, friendController.getAllFriends);

module.exports = router;
