const chatForm = document.getElementById('chatForm')
const textBox = document.getElementById('message')
const button = document.getElementById('sendButton')

const socket = new WebSocket(`ws://localhost:${window.location.port}`)

if (!(button instanceof HTMLInputElement) || !(textBox instanceof HTMLInputElement) || !(chatForm instanceof HTMLFormElement)) {
    throw new Error('Missing required elements')
}

socket.addEventListener('open', function (e) {
    console.log('Connected to Server')
})

socket.addEventListener('message', function (e) {
    console.log(`Message from server: ${e.data}`)
})

button.addEventListener('click', async (e) => {
    e.preventDefault()
    sendMessage(textBox.value)
}) 

function sendMessage(message: string) {
   if (socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.warn("WebSocket is not open. Current state: ", socket.readyState);
  }
}


