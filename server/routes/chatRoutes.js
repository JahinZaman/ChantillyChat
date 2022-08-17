const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
} = require("../controllers/chatControllers");

router.route("/").post(protect, accessChat);

router.route("/").get(protect, fetchChats);

router.route("/group").post(protect, createGroupChat);

router.route("/rename").put(protect, renameGroupChat);

router.route("/groupremove").put(protect, removeFromGroupChat);

router.route("/groupadd").put(protect, addToGroupChat);

module.exports = router;
