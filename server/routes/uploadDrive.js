const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { google } = require('googleapis');
const OAuth2Data = require("../config/credentials.json");

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[2];

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

const SCOPES =
    "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";



app.get("/api/v1/drive/autenticacion", (req, res) => {

    var url = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log(url);
    res.status(200).json({
        ok: true,
        url
    })
});

app.get("/api/v1/drive/callback", function (req, res) {
    const code = req.query.code;
    if (code) {
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log("Error en la autenticacion");
                console.log(err);
            } else {
                console.log("Autenticado correctamente");
                console.log(tokens)
                oAuth2Client.setCredentials(tokens);
                res.status(200).json({
                    ok: true,
                    tokens
                })
                authed = true;
            }
        });
    }
});

app.post('/api/v1/upload/drive', upload.single('file'), async (req, res) => {


    const tokenAccess = req.body.tokenAccess;

    console.log(tokenAccess);

    if (!tokenAccess) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "El token access es necesario"
            }
        })
    } else {

        oAuth2Client.setCredentials = {
            access_token: tokenAccess
        };

        const fileMetaData = {
            name: req.file.originalname,
            mimeType: 'application/vnd.google-apps.presentation'
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path)
        };

        const googleDrive = google.drive({version: 'v3'});

        await googleDrive.files.create({
            auth: oAuth2Client,
            requestBody: {
                ...fileMetaData,
                type: 'anyone',
                writersCanShare: true
            },
            media
        })

        await googleDrive.permissions.create({
            auth: oAuth2Client,
            fileId: data.id,
            requestBody: {
                type: 'anyone',
                allowFileDiscovery: false,
                role: 'reader'
            },
            fields: 'id'
        });

    }

});

module.exports = app;