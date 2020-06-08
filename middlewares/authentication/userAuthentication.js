const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const bcrypt = require('bcrypt')
const Receptionist = require('../../models/receptionist')
const receptionist = new Receptionist()

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async function (email, password, next) {
        try {
            let hash = await bcrypt.hash(password, 10)
            // console.log(password)
            // console.log(hash)
            let receptionistData = await receptionist.findByEmail(email)
            let passwordMatch = await bcrypt.compare(password, receptionistData.password)
            
            if (passwordMatch) {
                return next(null, receptionistData)
            }
            else {
                return next({'login': 'Incorrect email or password'})
            }
        }
        catch (err) {
            next({'login': "Incorrect email or password"})
        }
    }
))

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: process.env.JWT_SECRET
},
    function (jwtPayload, next){
        if (Date.now() > jwtPayload.expires){
            return next('jwt expired')
        }

        return next(null, jwtPayload)
    }
))
