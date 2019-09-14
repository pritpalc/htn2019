const express = require('express');
const db = require('../../db')
const router = express.Router();

/* GET users listing. */
router.get('/preferences', (req, res) => {
    if(req.user.type === "child"){
        db.getChildPreferences(req.user.user.username, req.user.childId).then(prefs => res.json(prefs))
    } else {
        res.status(401).json({status:"ur not a child"})
    }
});

router.get('/preferences/:childId', (req, res) => {
    if(req.user.type !== "child"){
        db.getChildPreferences(req.user.user.username,req.params.childId).then(prefs => res.json(prefs))
    } else {
        res.status(401).json({status:"ur a child"})
    }
});

router.post('/preferences', (req, res) => {
    if(req.user.type === "child"){
        db.updateChildPreferences(req.user.user.username, req.user.childId, req.body).then(result => {
            if(result){
                res.status(200).json({status:"successfull"})
            } else {
                res.status(500).json({status:"internal server error"})
            }
        })
    } else {
        res.status(401).json({status:"ur not a child"})
    }
})

router.post('/preferences/:childId', (req, res) => {
    if(req.user.type !== "child"){
        db.updateChildPreferences(req.user.user.username, req.user.childId, req.body).then(result => {
            if(result){
                res.status(200).json({status:"successfull"})
            } else {
                res.status(500).json({status:"internal server error"})
            }
        })
    } else {
        res.status(401).json({status:"ur a child"})
    }
})

module.exports = router;
