let ws: WebSocket | undefined
let nextID = 0
const pending = new Map<number, { resolve: (value: any) => void, reject: (reason: Error) => void }>()

export function connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(url)

        socket.addEventListener("open", () => {
            ws = socket
            resolve()
        })
        socket.addEventListener("error", () => {
            reject(new Error("Could not connect to Chromium's debug WebSocket"))
        })
    })
}