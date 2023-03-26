const express = require("express");
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAccess = require("../middlewares/checkAccess");

const router = express.Router();

router.post("/addItem", authMiddleware, itemController.addItem);
router.delete("/deleteItem/:id", authMiddleware, itemController.deleteItem);
router.put("/updateItem", authMiddleware, itemController.updateItem);
router.get(
  "/items/:list_id/:selectedUser",
  authMiddleware,
  checkAccess,
  itemController.getItemsByListId
);

module.exports = router;
