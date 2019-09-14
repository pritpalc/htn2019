//passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const db = require('./db')
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, 
    (username, password, cb) => {
        console.log(username)
        console.log(password)
        if(password !== username) {
            db.getUser(username).then(user => {
                if (!user) {
                    return cb(null, false, {message: 'Incorrect email or password.'});
                }
                if (password !== user.password) {
                    return cb(null, false, {message: 'Incorrect email or password.'});
                }
                return cb(null, {
                    type: "user",
                    user: user
                }, {message: 'Logged In Successfully'});
            })
        } else {
            db.getChild(username).then(child => {
                if(!child) {
                    return cb(null, false, {message: 'Incorrect code.'});
                }
                return cb(null, {
                    type: "child",
                    childId: child.childId,
                    user: child.parent
                }, {message: 'Logged In Successfully'} )
            })
        }
        
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return 
    }
));
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'your_jwt_secret'
},
(jwtPayload, cb) => cb(null,jwtPayload)
));