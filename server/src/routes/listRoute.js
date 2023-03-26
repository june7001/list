const express = require("express");
const listController = require("../controllers/listController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAccess = require("../middlewares/checkAccess");

const router = express.Router();

router.post("/createList", authMiddleware, listController.createList);
router.get(
  "/user/:selectedUser/lists/:id",
  authMiddleware,
  checkAccess,
  listController.getListById
);
router.get(
  "/user/:selectedUser/lists",
  authMiddleware,
  checkAccess,
  listController.getListsByUsername
);

module.exports = router;
