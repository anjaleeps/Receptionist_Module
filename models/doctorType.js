const db = require("../db")

function DoctorType(){

}

DoctorType.prototype.findAll = function (){
    let query = "SELECT * FROM doctor_type"
    try{
        let result = db.any(query)
        return result
    }
    catch(err){
        throw new Error()
    }
}

module.exports = DoctorType