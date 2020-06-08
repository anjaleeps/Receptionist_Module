const home = require('./home.js')
const patient = require('./patient')
const patientSearch = require('./patient/search')
const appointment = require('./appointment')
const doctor = require('./doctor')
const session = require('./session')
const login = require('./user/login')
const logout = require('./user/logout')
const authorization = require('../middlewares/authorization/userAuthorization')

module.exports = function (app) {
    app.use('/patient/search', authorization.isLoggedIn, patientSearch)
    app.use('/patient', authorization.isLoggedIn, patient)
    app.use('/appointment', authorization.isLoggedIn, appointment)
    app.use('/doctor', authorization.isLoggedIn, doctor)
    app.use('/session', authorization.isLoggedIn, session)
    app.use('/logout', authorization.isLoggedIn, logout)
    app.use('/login', login)
    app.use('/', home)
} 

