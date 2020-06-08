const db = require('../db')

function Receptionist(){

}

Receptionist.prototype.findByEmail =async function(email){
    let query = "select * from receptionist where email=$1"
    try{
        let result = db.oneOrNone(query, email)
        console.log(result)
        return result
    }
    catch(err){
        console.log(err)
        throw err
    }
}

module.exports = Receptionist