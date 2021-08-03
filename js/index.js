/* Set preferred/short name */

function setPreferredName() {
    const fullName = document.querySelector('#full-name')
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
document.querySelector('#full-name').addEventListener('keyup', setPreferredName)
document.querySelector('#preferred-name').addEventListener('keyup', (e) => {
    document.querySelector('span.input-sizer[data-field="preferred-name"]').innerText = e.target.value    
    sizePreferredName()
})

