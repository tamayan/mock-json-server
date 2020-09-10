const functions = require('firebase-functions');
const express = require('express')
const basicAuth = require('express-basic-auth')

const app = express()

const name = `${functions.config().basic.name}`
const pass = `${functions.config().basic.pass}`

app.use(basicAuth({
    challenge: true,
    authorizer(username, password) => {
        const userMatch = basicAuth.safeCompare(username, name)
        const passMatch = basicAuth.safeCompare(password, pass)
        return userMatch & passMatch;
    }
}));

app.get("/users", (req, res, next) => {
    res.json(require('./data/users.json'))
});

app.get("/videos", (req, res, next) => {
    res.json(require('./data/videos.json'))
});

const api = functions.https.onRequest(app);
module.exports = { api };
