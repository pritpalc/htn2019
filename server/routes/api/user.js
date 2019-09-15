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

router.post('/newChild', (req,res) => {
    db.newChild(req.user.user.username,req.body.prefs,req.body.code,req.body.childDescription,req.body.tasks)
        .then(child => res.json(child))
})


router.get('/notifications', (req, res) => {
    db.getUserNotifications(req.user.user.username).then(notifications => res.json(notifications))
})

module.exports = router;
