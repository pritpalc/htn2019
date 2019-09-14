//passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db')
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, 
    (username, password, cb) => {
        db.getUser(username).then(user => {
            if (!user) {
                return cb(null, false, {message: 'Incorrect email or password.'});
            }
            if (password !== user.password) {
                return cb(null, false, {message: 'Incorrect email or password.'});
            }
            return cb(null, user, {message: 'Logged In Successfully'});
        })
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return 
    }
));