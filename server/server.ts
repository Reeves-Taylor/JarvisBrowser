import express, {type Express, type Request, type Response} from "express"
import cors from "cors"
import http from "http"
import { WebSocketServer, WebSocket } from "ws"


const port = process.env.PORT || 3000
const app: Express = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

app.use(express.static('public'))
app.use(express.static('dist'))

type MessagePayload = {
    Message: string,
    Id: string
}

app.use(cors())
app.use(express.json())

wss.on('connection', function connection(ws) {
    console.log('A new client connected!')
    ws.send('Welcome new client!')
    ws.on('message', function incoming(message) {
        console.log(`recieved: ${message}`)
        ws.send(`Got your message: ${message}`)
    })
})





app.get("/", (req: Request, res: Response) => {
    res.send("Hello Worldy!")
})



server.listen(port, () => console.log(`Listening on port ${port}`))