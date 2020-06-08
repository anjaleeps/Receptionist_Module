let submitButton = document.querySelector("#submitButton").addEventListener('click', registerPatient)

async function registerPatient(e) {
    e.preventDefault()
    let formData = {
        firstName: document.querySelector('#cfirstname').value,
        lastName: document.querySelector('#clastname').value,
        phoneNumber: document.querySelector('#cphonenumber').value,
        birthDate: document.querySelector('#cbirthdate').value,
        email: document.querySelector('#cemail').value,
        houseNumber: document.querySelector('#chousenumber').value,
        street: document.querySelector('#cstreet').value,
        city: document.querySelector('#ccity').value
    }
    console.log(formData)
    try {
        let response = await sendPatientData(formData)
        if (response.ok) {
            let data = await response.json()
            let patientId = data.patientId
            window.location.pathname = '/receptionist/patient/' + patientId
            return
        }
        let errors= await response.json()
        showErrors(errors.errors)
    }
    catch (err) {
        console.log(err)
    }

}

function showErrors(errors){
    let keys = []
    errors.forEach(errorObj => {
        for (let [key, value] of Object.entries(errorObj)){
            if (!(keys.includes(key))){
                if (key == 'patientId'){
                    alert(value)
                    return
                }
                let id = '#c'+key.toLowerCase()
                let element = document.querySelector(id)
                let notif = document.createElement('p')
                let text = document.createTextNode(value)
                notif.appendChild(text)
                notif.classList.add('help-block')
                notif.style.color='red'
                let next = element.parentNode.getElementsByTagName('p')[0]
                if (next){
                    next.parentNode.removeChild(next)
                }
                element.parentNode.appendChild(notif)
                keys.push(key)
            }           
        }
    })
}

async function sendPatientData(formData) {
    try {
        let response = await fetch('/receptionist/patient/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        return response
    }
    catch (err) {
        throw err
    }
}