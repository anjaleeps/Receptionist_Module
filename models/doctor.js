const db = require('../db')

function Doctor(){

}

Doctor.prototype.findByType = async function (type_id){
    let query = "SELECT doctor_id, INITCAP(first_name || ' ' || last_name) AS doctor_name FROM doctor WHERE doctor_type_id = $1"
    try{
        let result = await db.any(query, type_id)
        console.log(result)
        return result
    }
    catch(err){
        console.log(err)
        throw err
    }
}

module.exports = Doctor