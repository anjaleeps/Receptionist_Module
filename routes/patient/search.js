const patientController = require('../../controllers/patientController')
const express = require('express')
const router = express.Router()

router.get('/:phoneNumber', patientController.findPatientByPhoneNumber)

module.exports = router