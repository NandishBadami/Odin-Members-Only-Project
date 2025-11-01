const {Router} = require('express');
const controller = require('../controllers/controller');
const passport = require('passport');

const router = Router();

router.get('/', controller.getAllMessages);
router.get('/sign-up', controller.sign_up_get);
router.post('/sign-up', controller.sign_up_post);
router.get('/login', controller.login);
router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureMessage: true}));
router.get('/logout', controller.logout);
router.get('/profile', controller.profile);
router.get('/update-membership', controller.updateMembershipGet);
router.post('/update-membership', controller.updateMembershipPost);
router.get('/new-message', controller.createMessageGet);
router.post('/new-message', controller.createMessagePost);
router.get('/update-admin', controller.updateAdminGet);
router.post('/update-admin', controller.updateAdminPost);
router.get('/delete-message/:id', controller.deleteMessage);

module.exports = router;