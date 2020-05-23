const nextButton = document.querySelector('#nextButton')
const cancelButton = document.querySelector('#cancelButton')
const cdoctortype = document.querySelector('#cdoctortype')
const mark = document.querySelector('#mark')
const info = document.querySelector('#info')
// const sessionContent = document.querySelector('#sessionContent')
const doctorNameTemp = document.querySelector('#doctorNameTemp')
const sessionTemp = document.querySelector('#sessionTemp')
const radioTemp = document.querySelector('#radioTemp')

let formStatus = 0
let handlers = [showDoctors, showSessions, schedule]

nextButton.addEventListener('click', showDoctors)
cancelButton.addEventListener('click', cancel)

async function showDoctors(e) {
    e.preventDefault()
    let doctorType = cdoctortype.value
    if (formStatus === 0 && doctorType != 0) {
        try {
            let data = await getDoctorList(doctorType)
            let doctorList = data.doctors
            console.log(doctorList)
            addDoctors(doctorList)
            formStatus = 1
            addNextHandler()
        }
        catch (err) {
            console.log(err)
        }
    }
}

async function getDoctorList(doctorType) {
    try {
        let response = await fetch(`/doctor?doctorTypeId=${doctorType}`, { method: 'GET' })
        let data = await response.json()
        return data
    }
    catch (err) {
        console.log(err)
    }
}

function addDoctors(doctorList) {
    let clone = doctorNameTemp.content.cloneNode(true)
    let select = clone.querySelector('#cdoctor')
    doctorList.forEach(doctor => {
        let newOption = document.createElement('option')
        let text = document.createTextNode(doctor.doctor_name)
        newOption.appendChild(text)
        newOption.value = doctor.doctor_id
        select.appendChild(newOption)
    })
    mark.appendChild(clone)
    cdoctortype.disabled = true
}

async function showSessions(e) {
    e.preventDefault()
    let doctorId = document.querySelector('#cdoctor').value
    if (formStatus === 1 && doctorId != 0) {
        try {
            let data = await getSessionList(doctorId)
            let sessionList = data.sessions
            console.log(sessionList)
            addSessions(sessionList)
            formStatus = 2
            addNextHandler()
        }
        catch (err) {
            console.log(err)
        }
    }
}

async function getSessionList(doctorId) {
    try {
        let response = await fetch(`/session?doctorId=${doctorId}`, { method: 'GET' })
        let data = await response.json()
        return data
    }
    catch (err) {
        console.log(err)
    }
}

function addSessions(sessionList) {
    let sessionClone = sessionTemp.content.cloneNode(true)
    let csession = sessionClone.querySelector('#csession')

    sessionList.forEach(session => {
        let radioClone = radioTemp.content.cloneNode(true)
        let option = radioClone.querySelector('#optionRadio')
        let text = radioClone.querySelector('#text')
        option.value = session.session_id
        text.textContent = `${session.day} from ${session.start_time} to ${session.end_time}`
        csession.appendChild(radioClone)
    })
    let dataButton = document.querySelector('#dataButton')
    dataButton.addEventListener('click', showSessionInfo)
    document.querySelector('#dateblock').style.display = "block"
    mark.append(sessionClone)
    cdoctor.disabled = true
}

async function showSessionInfo(e) {
    e.preventDefault()
    let checked = document.querySelector('input[type="radio"]:checked')
    let date = document.querySelector('#cdate').value
    if (checked && date) {
        let sessionId = checked.value
        console.log(sessionId)
        console.log(date)
        let data = await getSessionInfo(date, sessionId)
        let info = data.appointment
        addSessionInfo(info)
    }
}

async function getSessionInfo(date, sessionId) {
    try {
        let response = await fetch(`/session/${sessionId}?date=${date}`, { method: 'GET' })
        let data = await response.json()
        return data
    }
    catch (err) {
        console.log(err)
    }
}

function addSessionInfo(data) {
    info.innerHTML = ''
    if (data) {
        let newP1 = document.createElement('p')
        let text = document.createTextNode(`Available Number - ${data.available_number}`)
        newP1.appendChild(text)
        info.appendChild(newP1)
        let newP2 = document.createElement('p')
        text = document.createTextNode(`Appointment Time - ${data.appointment_time}`)
        newP2.appendChild(text)
        info.appendChild(newP2)
    }
    else {
        let newP1 = document.createElement('p')
        let text = document.createTextNode('No appointments scheduled yet')
        newP1.appendChild(text)
        info.appendChild(newP1)
    }
}

async function schedule(e) {
    e.preventDefault()
    let checked = document.querySelector('input[type="radio"]:checked')
    let date = document.querySelector('#cdate').value
    console.log(date)
    if (formStatus === 2 && checked && date) {
        let appointment = {
            appointment: {
                sessionId: checked.value,
                date: date,
                patientId: document.querySelector('#patientId').value
            }
        }
        try {
            let response = await postAppointment(appointment)
            if (response.ok) {
                let data = await response.json()
                let appointmentId = data.appointmentId
                window.location.pathname = `/appointment/${appointmentId}`
            }
            else {
                let errors = await response.json()
                showErrors(errors.errors)
            }

        }
        catch (err) {
            console.log(err)
        }
    }
}

function showErrors(errors) {
    let keys = []
    errors.forEach(errorObj => {
        for (let [key, value] of Object.entries(errorObj)) {
            if (!(keys.includes(key))) {
                if (key == 'patientId' || key == 'sessionId'){
                    alert(value)
                    return
                }
                let id = '#c' + key.toLowerCase()
                let element = document.querySelector(id)
                let notif = document.createElement('p')
                let text = document.createTextNode(value)
                notif.appendChild(text)
                notif.classList.add('help-block')
                notif.style.color = 'red'
                let next = element.parentNode.getElementsByTagName('p')[0]
                if (next) {
                    next.parentNode.removeChild(next)
                }
                element.parentNode.appendChild(notif)
                keys.push(key)
            }
        }
    })
}

async function postAppointment(appointment) {
    try {
        let response = await fetch('/appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        })
        return response

    }
    catch (err) {
        throw err
    }
}

function addNextHandler(e) {
    nextButton.removeEventListener('click', handlers[formStatus - 1])
    nextButton.addEventListener('click', handlers[formStatus])
}

function cancel(e) {
    e.preventDefault()
    location.reload()
}