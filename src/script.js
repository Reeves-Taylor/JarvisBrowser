// src/script.ts
var chatForm = document.getElementById("chatForm");
var textBox = document.getElementById("message");
var button = document.getElementById("sendButton");
var socket = new WebSocket("ws://localhost:3000");
if (!(button instanceof HTMLInputElement) || !(textBox instanceof HTMLInputElement) || !(chatForm instanceof HTMLFormElement)) {
  throw new Error("Missing required elements");
}
socket.addEventListener("open", function(e) {
  console.log("Connected to Server");
});
socket.addEventListener("message", function(e) {
  console.log(`Message from server: ${e.data}`);
});
button.addEventListener("click", async (e) => {
  e.preventDefault();
  sendMessage(textBox.value);
});
function sendMessage(message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.warn("WebSocket is not open. Current state:", socket.readyState);
  }
}
