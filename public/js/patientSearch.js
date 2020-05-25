let searchButton = document.querySelector('#searchButton').addEventListener('click', searchPatient)

function searchPatient(e) {
    e.preventDefault()
    let phoneNumberInput = document.querySelector('#phoneNumberInput')
    let input = phoneNumberInput.value
    input = input.trim()
    if (input.charAt(0) != '0') {
        input = '0' + input
    }
    if (validateInput(input)) {
        window.location.pathname = "/receptionist/patient/search/" + input
    }
}

function validateInput(input) {
    console.log(input)
    if (!(/^\d+$/.test(input))) {
        return false
    }
    else if (input.length !== 10) {
        return false
    }
    return true
}