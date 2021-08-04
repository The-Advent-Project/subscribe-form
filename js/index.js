/* 
    Set preferred/short name
*/

function setPreferredName() {
    const fullName = document.querySelector('#name')
    const preferredNameContainer = document.querySelector('label[for="preferred-name"]')
    const inputSizer = document.querySelector('span.input-sizer[data-field="preferred-name"]')
    const preferredName = document.querySelector('#preferred-name')
    if(! fullName.value || fullName.value === "") {
        preferredNameContainer.setAttribute('data-active', 'false')
        preferredName.value = ""
        inputSizer.innerText = ""
    }
    else {
        const shortName = fullName.value.split(/\s/)
        preferredName.value = shortName[0]
        inputSizer.innerText = shortName[0]
        // Set reveal timeout
        if(preferredNameContainer.getAttribute('data-active') === 'false') {
            setTimeout( () => {
                preferredNameContainer.setAttribute('data-active', 'true')
            }, 1500 )
        }
        else {
            preferredNameContainer.setAttribute('data-active', 'true')
        }
    }
    sizePreferredName()
}

function sizePreferredName() {
    const inputSizer = document.querySelector('span.input-sizer[data-field="preferred-name"]')
    const preferredName = document.querySelector('#preferred-name')
    preferredName.style.width = `${inputSizer.offsetWidth + 15}px`
}

setPreferredName()
sizePreferredName()
document.querySelector('#name').addEventListener('keyup', setPreferredName)
document.querySelector('#preferred-name').addEventListener('keyup', (e) => {
    document.querySelector('span.input-sizer[data-field="preferred-name"]').innerText = e.target.value    
    sizePreferredName()
})

/* Handle form submission */

function submitForm(form) {
    // Get fields
    const name = form.querySelector('#name').value
    const email = form.querySelector('#email').value
    const preferredName = form.querySelector('#preferred-name').value
    const data = {
        'name': name,
        'email': email,
        'PreferredName': preferredName
    }
    // take the data and post to the netlify function
    fetch('.netlify/functions/subscribe', {
        body: JSON.stringify(data),
        method: 'POST'
        }).then(response => {
        return response.json()
        }).then( data => {
        console.log(data)
        return
        // old stuff
        statusText.innerText = data.message
        if(data.code == 200) {
            statusText.setAttribute('class', 'success')
        }
        else {
            statusText.setAttribute('class', 'error')
        }
        })
    console.log(name, email, preferredName)
}

document.querySelector('#subscribe').addEventListener('submit', (e) => {
    e.preventDefault()
    submitForm(e.target)
})