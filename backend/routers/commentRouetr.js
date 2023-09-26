const express = require("express");
const { giveComment } = require("../controller/commentController");

const router = express.Router();

router.route("/:id").post(giveComment);

module.exports = {
  router,
};
