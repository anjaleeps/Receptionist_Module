let db = require('../db')

function Session(){

}

Session.prototype.findAllByDoctor = async function (doctorId){
    let query = "SELECT session_id, doctor_id, day, to_char(start_time, 'HH24:MI') as start_time, \
        to_char(end_time, 'HH24:MI') as end_time FROM session WHERE doctor_id = $1"
    try{
        let result = await db.any(query, doctorId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}

Session.prototype.findOneById = async function(sessionId){
    let query = "select start_time, day from session where session_id=$1"
    try{
        let result = await db.one(query, sessionId)
        console.log(result)
        return result
    }
    catch(err){
        console.log(+err)
        throw err
    }
}

Session.prototype.findOne = async function(sessionId){
    let query = "select to_char(start_time, 'HH24:MI') as start_time, to_char(end_time, 'HH24:MI') as end_time, day from session where session_id=$1"

    try{
        let result = await db.oneOrNone(query, sessionId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}

module.exports = Session