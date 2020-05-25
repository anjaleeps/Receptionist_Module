const db = require("../db")

function DoctorType(){

}

DoctorType.prototype.findAll = async function (){
    let query = "SELECT * FROM doctor_type"
    try{
        let result = await db.any(query)
        return result
    }
    catch(err){
        throw new Error()
    }
}

module.exports = DoctorType