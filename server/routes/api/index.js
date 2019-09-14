const express = require('express');
const user = require('./user')
const child = require('./child')
const passport = require('passport')
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("")
});

router.use('/user', passport.authenticate('jwt', {session: false}), user)
router.use('/child', passport.authenticate('jwt', {session: false}), child)

module.exports = router;
