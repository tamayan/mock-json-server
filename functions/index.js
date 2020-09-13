const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

// const cookieParser = require('cookie-parser')();
// const cors = require('cors')({
//     origin: true
// });_

const app = express();

admin.initializeApp();

const validateFirebaseIdToken = async (req, res, next) => {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
        res.status(403).send('Unauthorized');
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies) {
        idToken = req.cookies.__session;
    } else {
        res.status(403).send('Unauthorized');
        return;
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedIdToken;

        next();
        return;
    } catch (error) {
        res.status(403).send('Unauthorized');
        return;
    }
};

// app.use(cors);
// app.use(cookieParser);

app.use(validateFirebaseIdToken);

app.get("/users", (req, res) => {
    res.json(require('./data/users.json'))
});

app.get("/videos", (req, res) => {
    res.json(require('./data/videos.json'))
});

exports.app = functions.https.onRequest(app);
