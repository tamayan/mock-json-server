const functions = require('firebase-functions');
const express = require('express')
const basicAuth = require('express-basic-auth')

const app = express()

const pass = `${functions.config().basic.pass}`

app.use(basicAuth({
    users: {
        'admin': pass
    },
    challenge: true
}));

app.get("/users", (req, res) => {
    res.json(require('./data/users.json'))
});

app.get("/videos", (req, res) => {
    res.json(require('./data/videos.json'))
});

const api = functions.https.onRequest(app);

module.exports = {
    api
};
