const express = require('express');
const app = express();

//Modelo del Usuario
const User = require('../models/User');

//Modulos de Json Web Token
const jwt = require('jsonwebtoken');

//Modules de Google Auth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true

    }

}


// Servicio de google
app.post('/api/v1/google', async (req, res) => {

    let token = req.body.idToken;
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        })

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Este usuario ya existe con es correo, porfavor inicia sesion con tu cuenta"
                    }
                })
            } else {

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRED })

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }
        } else {
            // SI el usuario no existe en la base de datos
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.image;
            user.google = googleUser.google;
            user.password = ":)";

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRED })

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })

            })

        }

    });
});


module.exports = app;
