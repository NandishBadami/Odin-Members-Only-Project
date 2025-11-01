const db = require('../db/query');
const bcrypt = require('bcryptjs');

async function getAllMessages(req, res) {
    if(!req.isAuthenticated()) res.redirect('/login');
    else {
        let db_messages = await db.getAllMessages();
        for(let message of db_messages) message.user = await db.getUserById(message.user_id);
        res.render('index.ejs', {messages: db_messages, user: req.user});
    }
}

function sign_up_get(req, res) {
    res.render('../views/sign-up-form.ejs');
}

async function sign_up_post(req, res, next) {
    if((req.body.first_name).trim() == '' || (req.body.last_name).trim() == '' || (req.body.username).trim() == '' || (req.body.password).trim() == '' || (req.body.confirm_password).trim() == '') {
        res.render('../views/sign-up-form.ejs', {error: 'All fields are mandatory'});
        return;
    }
    if(req.body.password !== req.body.confirm_password) {
        res.render('../views/sign-up-form.ejs', {error: 'Password and Confirm password does not match!'});
        return;
    }
    const password = await bcrypt.hash(req.body.password, 10);
    const error = await db.createUser(req.body.first_name, req.body.last_name, req.body.username, password);
    if(error) {
        res.render('../views/sign-up-form.ejs', {error: error});
        return;
    }
    const user = await db.getUser(req.body.username);
    req.login(user, err => {
        if(err) return next(err);
        res.redirect('/');
    });
    //res.redirect('/');
}

function login(req, res) {
    res.render('../views/login-form.ejs', {error: req.session.messages});
}

function logout(req, res, next) {
    req.logout((err) => {
        if(err) return next(err);
        res.redirect('/login');
    });
}

function profile(req, res) {
    if(req.isAuthenticated()) res.render('../views/profile.ejs', {user: req.user});
    else res.redirect('/login');
}

function updateMembershipGet(req, res) {
    if(req.isAuthenticated()) res.render('../views/update-membership.ejs');
    else res.redirect('/login');
}

async function updateMembershipPost(req, res) {
    if(req.body.password == '9148' && req.isAuthenticated()) {
        await db.updateMembership(req.user.email);
        res.redirect('/profile');
    }
    else res.render('../views/update-membership.ejs', {error: 'Incorrect Password'});
}

function createMessageGet(req, res) {
    if(req.isAuthenticated()) res.render('../views/create-message.ejs');
    else res.redirect('/login');
}

async function createMessagePost(req, res) {
    if((req.body.title).trim() == '' || (req.body.message).trim() == '') res.render('../views/create-message.ejs', {error: 'All fields are mandatory!'});
    else {
        await db.createMessage(req.body.title, req.body.message, new Date(), req.user.id);
        res.redirect('/');
    }
}

function updateAdminGet(req, res) {
    if(req.isAuthenticated()) res.render('../views/update-admin.ejs');
    else res.redirect('/');
}

async function updateAdminPost(req, res) {
    if(req.isAuthenticated() && req.body.password == '706524') {
        await db.updateAdmin(req.user.email);
        res.redirect('/profile');
    } else res.render('../views/update-admin.ejs', {error: 'Incorrect Password'});
}

async function deleteMessage(req, res) {
    if(req.isAuthenticated() && req.user.admin) await db.deleteMessage(req.params.id);
    res.redirect('/');
}

module.exports = {
    getAllMessages,
    sign_up_get,
    sign_up_post,
    login,
    logout,
    profile,
    updateMembershipGet,
    updateMembershipPost,
    createMessageGet,
    createMessagePost,
    updateAdminGet,
    updateAdminPost,
    deleteMessage
}