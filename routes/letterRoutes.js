const express = require("express");
const letterController = require("../controllers/letterController");

const router = express.Router();

router.post("/save", letterController.saveLetter);

module.exports = router;
