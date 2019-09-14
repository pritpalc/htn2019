const express = require('express');
const sprites = require('../sprites');
const merge = require('merge-images')
const path = require('path')
const router = express.Router();
const ncanvas = require("canvas")
const Canvas = ncanvas.Canvas
Canvas.Image = ncanvas.Image
/* GET users listing. */

frameCounts = [7,7,7,7,8,8,8,8,9,9,9,9,6,6,6,6,13,13,13,13,6]
router.get('/', (req, res) => res.json(sprites));
router.post('/layer', (req, res) => {
    const {layers,row} = req.body

    merge(layers.map(p => ({src:path.join('sprites',p),y:-(64*row)})), {Canvas:Canvas,height:64, width:64*frameCounts[row]}).then(value => res.send(value))
})
router.use('/',express.static('sprites'))

module.exports = router;
