const Letter = require("../models/Letter");

const saveLetter = async (letterData) => new Letter(letterData).save();

const getLettersByUserId = async (userId) => Letter.find({ userId });

module.exports = { saveLetter, getLettersByUserId };
