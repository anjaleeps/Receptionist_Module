const appointmentController = require('../../controllers/appointmentController')
const express = require('express')
const router = express.Router()
const {reqFormatter, appointmentValidationRules, validate} = require('../../middlewares/validation/appointmentValidator')

router.post('/', reqFormatter, appointmentValidationRules(), validate, appointmentController.createAppointment)
router.get('/new', appointmentController.sendForm)
router.get('/:appointmentId', appointmentController.getAppointment)

module.exports = router