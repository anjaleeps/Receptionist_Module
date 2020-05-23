const { check, validationResult } = require('express-validator')
const Patient = require('../../models/patient')

const patient = new Patient()

const editValidationRules = function () {
    let today = new Date()
    let strToday = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
    
    return [
        check('patientId').custom(async patientId => {
            return patient.findOneById(patientId).then(p=>{
                if (!p){
                    return Promise.reject("Patient not registered in the system")
                }
            })
        }),
        check('firstName').not().isEmpty().trim().escape().withMessage("Field cannot be empty"),
        check('lastName').not().isEmpty().trim().escape().withMessage("Field cannot be empty"),
        check('phoneNumber').not().isEmpty().withMessage("Field cannot be empty")
            .trim()
            .escape()
            .isLength(10).withMessage("Wrong length for phone number")
            .isNumeric({ no_symbols: true }).withMessage("Not a phone number")
            .custom(async (number, {req}) => {
                return patient.findOneByPhone(number).then((p) => {
                    if (p && p.patient_id!=req.body.patientId) {
                        return Promise.reject('Phone number is already in use')
                    }
                })
            }),
        check('birthDate').not().isEmpty().withMessage("Field cannot be empty")
            // .isDate().withMessage("Not a date")
            .isBefore(strToday).withMessage("Invalid birthday"),
        check('houseNumber').not().isEmpty().trim().escape().withMessage("Field cannot be empty"),
        check('street').not().isEmpty().trim().escape().withMessage("Field cannot be empty"),
        check('city').not().isEmpty().trim().escape().withMessage("Field cannot be empty"),
        check('email').not().isEmpty().withMessage("Field cannot be empty")
            .isEmail().withMessage("Not an email address")
            .normalizeEmail()
            .custom(async (email, {req}) => {
                console.log(email)
                return patient.findOneByEmail(email).then((p) => {
                    if (p && p.patient_id != req.body.patientId) {
                        return Promise.reject('Email is already in use')
                    }
                })
            })
    ]
}

const editValidate = function (req, res, next) {
    console.log(req.body)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
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
    editValidationRules,
    editValidate
}