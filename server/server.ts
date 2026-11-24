import express, {type Express, type Request, type Response} from "express"
import http from "http"
import { WebSocketServer, WebSocket } from "ws"
import * as phash from "./passwordHash.ts"



const env = process.env


if (!env.BROWSER_USERNAME) {
    console.error("Missing process.env.USERNAME");
    process.exit(1)
}
if (!env.PASSWORD_HASH) {
    console.error("Missing process.env.PASSWORD_HASH");
    process.exit(1)
}
if (!env.SECRET) {
    console.error("Missing process.env.SECRET");
    process.exit(1)
}
if (!env.PORT) {
    console.error("Missing process.env.PORT");
    process.exit(1)
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