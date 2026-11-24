import express, {type Express, type Request, type Response} from "express"
import http from "http"
import { WebSocketServer, WebSocket } from "ws"
import * as phash from "./passwordHash.ts"



const env = process.env


if (!env.USERNAME) {
    console.warn("Missing process.env.USERNAME");
}
if (!env.PASSWORD_HASH) {
    console.warn("Missing process.env.PASSWORD_HASH");
}
if (!env.SECRET) {
    console.warn("Missing process.env.SECRET");
}
if (!env.PORT) {
    console.warn("Missing process.env.PORT");
}
const port = env.PORT || 3000
const app: Express = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

app.use(express.static('public'))
app.use(express.static('dist'))


app.use(express.json())

wss.on('connection', function connection(ws) {
    console.log('A new client connected!')
    ws.send('Welcome new client!')
    ws.on('message', function incoming(message) {
        console.log(`recieved: ${message}`)
        ws.send(`Got your message: ${message}`)
    })
})


server.listen(port, () => console.log(`Listening on port ${port}`))