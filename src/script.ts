const chatForm = document.getElementById('chatForm')
const textBox = document.getElementById('message')
const button = document.getElementById('sendButton')
if (!(button instanceof HTMLInputElement) || !(textBox instanceof HTMLInputElement) || !(chatForm instanceof HTMLFormElement)) {
    throw new Error('Missing required elements')
}

const id = Math.floor(Math.random() * 10000000000000000000).toString(16)


button.addEventListener('click', async (e) => {
    e.preventDefault()
    const message = textBox.value
    const payload = {
        Message: message,
        Id: id
    }
    try {
        const response = await fetch('http://localhost:3000/', {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(payload)
        })
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`)
        }
    } catch (error) {
        console.error('Error sending message:', error)
    }
    
}) 