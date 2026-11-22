import express, {type Express, type Request, type Response} from "express"
import cors from "cors"
const app: Express = express()

app.use(cors())
app.use(express.json())

const port = 3000

type Message = {
    Message: string,
    Id: string
}

let tempMessage: Message | undefined

app.post('/', (req: Request, res: Response) => {
    const { Message, Id }: Message = req.body
    console.log(`Received message: ${Message} with ID: ${Id}`)
    tempMessage = { Message, Id }
    res.status(200).json({ message: 'Message received successfully' })
})

app.get('/', (req: Request, res: Response) => {
    const message = tempMessage
        ? `\nmessage: ${tempMessage.Message} with ID: ${tempMessage.Id}`
        : ''
    res.send(`Server is running${message}`)
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})