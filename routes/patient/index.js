const patientController = require('../../controllers/patientController')
const {patientValidationRules, validate} = require('../../middlewares/validation/patientValidator')
const {editValidationRules, editValidate} = require('../../middlewares/validation/editValidator')
const express = require('express')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('patient/new');
})
router.post('/', patientValidationRules(), validate, patientController.registerPatient)

router.get('/:patientId', patientController.findPatientById)
router.post('/:patientId', editValidationRules(), editValidate, patientController.editPatientData)
router.get('/:patientId/edit', patientController.getEditForm)

module.exports = router;
 