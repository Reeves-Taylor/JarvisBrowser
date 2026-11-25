import express, {type Express, type Request, type Response} from "express"
import http from "http"
import { WebSocketServer, WebSocket } from "ws"
import * as passwordHash from "./passwordHash.ts" // will be used later when logging in is created
import startBrowser, { proc } from "./browser.ts"
import * as cdp from "./cdp.ts"
import { log } from "console"


const env = process.env


if (!env.BROWSER_USERNAME) {
    console.error("Missing process.env.BROWSER_USERNAME");
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
    console.warn("Missing process.env.PORT, deafaulting to 3000");
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


async function startup() {
    let url 
    try {
        server.listen(port, () => console.log(`Listening on port ${port}`))
        url = await startBrowser()
    } catch {
        console.error("Could not start server or browser")
        proc.kill(1)
        process.exit(1)
    }
    return url
}

const WebSocketURL = await startup()
await cdp.connect(WebSocketURL)
console.log("CDP connected")


const handleShutdown = (signal: number | NodeJS.Signals) => {
    proc.kill(signal);
    process.exit(1)
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));