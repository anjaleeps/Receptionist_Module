const home = require('./home.js')
const patient = require('./patient')
const patientSearch = require('./patient/search')
const appointment = require('./appointment')
const doctor = require('./doctor')
const session = require('./session')

module.exports = function (app) {
    app.use('/patient/search', patientSearch)
    app.use('/patient', patient)
    app.use('/appointment', appointment)
    app.use('/doctor', doctor)
    app.use('/session', session)
    app.use('/', home)
} 

