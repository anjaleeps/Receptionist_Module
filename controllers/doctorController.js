const Doctor = require('../models/doctor')

exports.getDoctorList = function(req, res){
    let doctor = new Doctor()
    doctor.findByType(req.query.doctorTypeId)
        .then(doctorList => {
            res.json({doctors: doctorList})
        })
        .catch(err => {
            res.render('error/500')
        })
}