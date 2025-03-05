const { google } = require("googleapis");
const letterRepository = require("../repositories/letterRepository");
const { getUserById, findUserByGoogleId } = require("../repositories/userRepository");


const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


const drive = google.drive({ version: "v3", auth: oauth2Client });


const saveLetterToGoogleDrive = async (userId, content) => {
  try {
    const user = await findUserByGoogleId(userId);

    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    if (oauth2Client.isTokenExpiring()) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

      
      await updateUserTokens(userId, credentials.access_token, credentials.refresh_token);
    }

    const fileMetadata = {
      name: `Letter-${userId}-${Date.now()}.txt`,
      mimeType: "text/plain",
    };

    const media = {
      mimeType: "text/plain",
      body: content,
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

  
    return await letterRepository.saveLetter({
      userId,
      content,
      googleDriveId: file.data.id,
    });
  } catch (error) {
    console.error("Error saving letter to Google Drive:", error);
    throw new Error("Failed to save letter to Google Drive");
  }
};


module.exports = { saveLetterToGoogleDrive };