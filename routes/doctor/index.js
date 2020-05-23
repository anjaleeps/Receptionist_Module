const doctorController = require('../../controllers/doctorController')
const express = require('express')
const router = express.Router()

router.get('/', doctorController.getDoctorList)

module.exports = router  