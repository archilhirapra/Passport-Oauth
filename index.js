const express = require("express");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const InstagramStrategy = require("passport-instagram");
const https = require("https");
const path = require("path");
const fs = require("fs");


const app = express();
app.use(passport.initialize());

app.use(express.json());

// ---------- _GOOGLE_ ----------
passport.use(new googleStrategy({
    clientID: "1098094083936-etlcfp03gmibce8fnm3h3r78ngpt8bj8.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile)
}));

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get("/auth/google/callback", passport.authenticate("google"));

// ---------- _FACEBOOK_ ----------
passport.use(new FacebookStrategy({
        clientID: "2815105635465754",
        clientSecret: "cec05c9e4bed76fea48084da9a1b85b5",
        callbackURL: "https://localhost:3000/auth/facebook/callback"
}, function (accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile)
}));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }));

// ---------- _INSTAGRAM_ ----------
passport.use(new InstagramStrategy({
        clientID: "722944022348603",
        scope: "user_profile,user_media",
        clientSecret: "06a8169d0615ca9f837bc80cc5745ed9",
        callbackURL: "https://localhost:3000/auth/instagram/callback"
    }, function(accessToken, refreshToken, profile, done) {
    console.log('profile: ', profile);
    return done(null, profile);
    }
));

app.get('/auth/instagram',
    passport.authenticate('instagram'), (req, res) => {
        res.redirect('/');
    },);

app.get('/auth/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/login' }),  (req, res) =>{
        res.redirect('/');
    });

app.get('/', (req, res) => {
    res.send('Hello, you have been Authenticate !')
})

const sslServer = https.createServer(
    {
        key:fs.readFileSync(path.join(__dirname,"cert","key.pem")),
        cert:fs.readFileSync(path.join(__dirname,"cert","cert.pem")),
    },
    app
);

const port = process.env.PORT || 3000;
sslServer.listen(port,()=>console.log(`Server is up on port ${port}`));
