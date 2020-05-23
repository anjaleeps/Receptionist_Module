const { check, validationResult } = require('express-validator')
const Appointment = require('../../models/appointment')
const Patient = require('../../models/patient')
const Session = require('../../models/session')

let appointment = new Appointment()
let patient = new Patient()
let session = new Session()
let days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const reqFormatter = function (req, res, next) {
    req.body.patientId = req.body.appointment.patientId
    req.body.sessionId = req.body.appointment.sessionId
    req.body.date = req.body.appointment.date
    next()
}

const appointmentValidationRules = function () {
    let today = new Date()
    let strNextMonth = `${today.getFullYear()}-${today.getMonth()+2}-${today.getDate()}`
    let nextMonth = new Date(strNextMonth)

    return [
        check('patientId').not().isEmpty().withMessage("Patient cannot be empty")
            .custom(async patientId => {
                return patient.findOneById(patientId).then(p => {
                    if (!(p)) {
                        return Promise.reject("Patient does not exist")
                    }
                })
            }),
        check('sessionId').not().isEmpty().withMessage("You have to choose a session")
            .custom(async sessionId => {
                return session.findOneById(sessionId).then(s => {
                    if (!(s)) {
                        return Promise.reject("Session does not exist")
                    }
                })
            }),
        check('date').not().isEmpty().withMessage("You have to choose a date")
            .custom(async (date, { req }) => {
                console.log(req.body.sessionId)
                return session.findOne(req.body.sessionId).then(s=>{
                    if (s) {
                        let day = s.day
                        let parts = date.split('-')
                        let d = new Date(`${parts[2]}-${parts[0]}-${parts[1]} ${s.end_time}`)
                        if (d<today){
                            return Promise.reject('Cannot schedule for a passed session')
                        }
                        if (d>nextMonth){
                            return Promise.reject('Cannot schedule appointments more than a month in advance')
                        }
                        if (day.toLowerCase() != days[d.getDay()]) {
                            return Promise.reject(`Given date is not a ${day}!`)
                        }
                       
                    }
                })
               
            }),
        check('date').custom(async (date, {req})=>{
            return appointment.findOneByData(req.body.patientId, req.body.sessionId, date).then(app =>{
                if (app){
                    return Promise.reject("Already scheduled an appointment")
                }
            })
        })
    ]
} 

const validate = function (req, res, next) {
    console.log(req.body)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        console.log('going forward')
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => {
        extractedErrors.push({ [err.param]: err.msg })
    })
    console.log(extractedErrors)
    return res.status(422).json({
        errors: extractedErrors
    })
}

module.exports = {
    reqFormatter,
    appointmentValidationRules,
    validate
}