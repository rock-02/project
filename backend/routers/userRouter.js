const express = require("express");
const { regesterUser, login } = require("../controller/userController");
const { route } = require("../app");

const router = express.Router();

router.post("/regester", regesterUser);

router.post("/login", login);

module.exports = router;
