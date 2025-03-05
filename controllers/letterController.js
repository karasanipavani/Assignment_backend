const letterService = require("../services/letterService");

const saveLetter = async (req, res) => {
  try {
    const { userId, content } = req.body;
    
    const savedLetter = await letterService.saveLetterToGoogleDrive(userId, content);

    res.status(201).json(savedLetter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveLetter };
