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

module.exports = router;
