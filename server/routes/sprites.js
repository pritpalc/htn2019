const express = require('express');
const sprites = require('../sprites');
const merge = require('merge-images')
const path = require('path')
const router = express.Router();
const ncanvas = require("canvas")

const Canvas = ncanvas.Canvas
Canvas.Image = ncanvas.Image
/* GET users listing. */
router.get('/', (req, res) => res.json(sprites));
router.post('/layer', (req, res) => {
    const paths = req.body
   
    merge(paths.map(p => path.join('sprites',p)), {Canvas:Canvas}).then(value => res.send(value))
})
router.use('/',express.static('sprites'))

module.exports = router;
