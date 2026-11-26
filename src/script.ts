const chatForm = document.getElementById('chatForm')
const textBox = document.getElementById('message')
const button = document.getElementById('sendButton')
const canvas = document.querySelector('canvas')
const socket = new WebSocket(`${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}`)

if (!(button instanceof HTMLInputElement) || !(textBox instanceof HTMLInputElement) || !(chatForm instanceof HTMLFormElement) || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Missing required elements')
}
const ctx = canvas?.getContext("2d")

socket.binaryType = 'arraybuffer'

socket.addEventListener('open', function (e) {
    console.log('Connected to Server')
})

socket.addEventListener('message', async function (e) {
    
    if (e.data instanceof ArrayBuffer) {
        const blob = new Blob([e.data], {type: "image/jpeg"})
        const bitmap = await createImageBitmap(blob)
        ctx?.drawImage(bitmap, 0, 0)
    } else {
        console.log(`Message from server: ${e.data}`)
    }
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


