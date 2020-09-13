const functions = require('firebase-functions');
const express = require('express');

const app = express();

app.use((req, res, next) => {
    const key = functions.config().api.key;
    const authorization = req.headers.authorization;

    if (!authorization || authorization.split(' ')[0] !== 'Bearer') {
        throw new Error('Bad Key');
    }

    const request_key = authorization.split(' ')[1];
    if (!request_key || request_key !== key) {
        throw new Error('Bad Key');
    }

    next();
});

app.get("/users", (req, res) => {
    res.json(require('./data/users.json'))
});

app.get("/videos", (req, res) => {
    res.json(require('./data/videos.json'))
});

exports.app = functions.https.onRequest(app);
