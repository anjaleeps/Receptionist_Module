const appointmentController = require('../controllers/appointmentController')
const authorization = require('../middlewares/authorization/userAuthorization')
const express = require('express')
const router = express.Router()

router.get('/', authorization.isLoggedIn, appointmentController.sendHome)

module.exports = router