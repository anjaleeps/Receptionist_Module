const db = require('../db')

function Patient() { }

Patient.prototype.findOneByPhone = async function (phoneNumber) {
    var query = "SELECT patient_id FROM patient where phone_number = $1"
    try {
        let result = await db.oneOrNone(query, [phoneNumber])
        return result
    }
    catch (err) {
        throw err
    }
}

Patient.prototype.findOneByEmail = async function (email) {
    var query = "SELECT patient_id FROM patient where email = $1"
    try {
        let result = await db.oneOrNone(query, email)
        return result
    }
    catch (err) {
        throw err
    }
}

Patient.prototype.findOneById = async function (patientId) {
    var query = "SELECT patient_id, INITCAP(first_name || ' ' || last_name) AS  patient_name, \
     phone_number, email, extract(year from age(birth_date)) as age, house_number, INITCAP(street) AS street,\
     INITCAP(city) AS city FROM patient where patient_id = $1"
    try {
        let result = await db.oneOrNone(query, [patientId])
        console.log(result)
        return result
    }
    catch (err) {
        throw err
    }
}

Patient.prototype.findOne = async function(patientId){
    let query = "select patient_id, first_name, last_name, email, phone_number, to_char(birth_date, 'YYYY-MM-DD') as birth_date, \
        house_number, street, city from patient where patient_id=$1"
    
    try{
        let result = await db.oneOrNone(query, patientId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}

Patient.prototype.create = async function (patient) {
    var query = "INSERT INTO patient(first_name, last_name, phone_number, birth_date, email, house_number, street, city)\
     VALUES (${patient.firstName}, ${patient.lastName}, ${patient.phoneNumber}, ${patient.birthDate}, ${patient.email},\
     ${patient.houseNumber}, ${patient.street}, ${patient.city}) RETURNING patient_id"

    try {
        let patientData = await db.one(query, { patient: patient })
        return patientData
    }
    catch (err) {
        throw err
    }
}

Patient.prototype.updateOne = async function(patient){
    var query = "update patient set first_name=${patient.firstName}, last_name = ${patient.lastName}, \
        phone_number=${patient.phoneNumber}, birth_date=${patient.birthDate}, email=${patient.email}, \
        house_number=${patient.houseNumber}, street=${patient.street}, city=${patient.city}\
        where patient_id=${patient.patientId}"

    try{
        await db.none(query, {patient:patient})
        return
    }
    catch(err){
        throw err 
    }
}

module.exports = Patient