const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { google } = require('googleapis');
const OAuth2Data = require("../config/credentials.json");
const { OAuth2Client } = require('google-auth-library');


app.post('/api/v1/upload/drive', upload.single('file'), async (req, res) => {

    const idToken = req.body.idToken;

    const { client_id, client_secret, redirect_uris } = OAuth2Data.web;

    const oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0],
    )

    oauth2Client.credentials = {
        refresh_token: idToken
    };

    drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    });

    const { originalname, path, mimetype } = req.file;

    const fileMetaData = {
        name: originalname,
        mimeType: 'application/vnd.google-apps.presentation'
    };

    const media = {
        mimeType: mimetype,
        body: fs.createReadStream(path)
    };


    const uploadedFile = await drive.files.create({
        resource: fileMetaData,
        media
    })

});





module.exports = app;