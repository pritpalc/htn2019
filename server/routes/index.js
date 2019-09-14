const express = require('express');
const api = require('./api')
const auth = require('./auth')
const sprites = require('./sprites')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/api',api)
router.use('/auth',auth)
router.use('/sprites',sprites)

module.exports = router;
