const express = require('express');
const db = require('../../db')
const router = express.Router();

/* GET users listing. */
router.get('/preferences', (req, res) => {
    db.getUserPreferences(req.user.user.username).then(prefs => res.json(prefs))
});

router.post('/preferences', (req, res) => {
    db.updateUserPreferences(req.user.user.username, req.body).then(result => {
        if(result){
            res.status(200).json({status:"successfull"})
        } else {
            res.status(500).json({status:"internal server error"})
        }
    })
})

router.get('/children', (req, res) => {
    db.getChildren(req.user.user.username).then(children => res.json(children))
})

router.post('/registerToken', (req,res) => {
    db.registerPushToken(req.user.user.username,req.body.token).then(()  => res.json({status: 'success'}))
})

module.exports = router;
