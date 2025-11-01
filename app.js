const express = require('express');
const router = require('./routes/routers');
const db = require('./db/query');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const app = express();

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({extended: true}));

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.getUser(username);
            if(!user) return done(null, false, {message: 'Incorrect username'});
            const match = await bcrypt.compare(password, user.password);
            if(!match) return done(null, false, { message: 'Icorrect password'});
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserById(id);
        done(null, user);
    } catch (error) {
        done(err);
    }
});

app.use('/', router);

app.listen(3000, (err) => {
    if (err) throw err;
    console.log('http://127.0.0.1:3000');
});