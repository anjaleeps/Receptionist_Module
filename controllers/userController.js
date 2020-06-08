const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.login = async function (req, res) {
    passport.authenticate('local', { session: false }, function (err, receptionistData) {
        if (err || !receptionistData) {
            res.status(400).json({errors: [err]})
            return 
        }
    

        let payload = {
            id: receptionistData.receptionist_id,
            email: receptionistData.email,
            firstName: receptionistData.first_name,
            lastName: receptionistData.last_name,
            role: receptionistData.role_id,
            expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_TIME)
        }

        req.login(payload, { session: false }, err => {
            if (err) {
                res.status(400).json({errors: [{'login': "login error! try again"}]})
                return 
            }

            let token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET)

            res.cookie('jwt', token, { httpOnly: true, secure: true }) 
            res.status(200).json({ receptionistId: receptionistData.receptionist_id })

        })
    })(req, res)
}

exports.logout = async function(req, res){
    res.clearCookie('jwt')
    res.redirect('/receptionist/logout')
}

