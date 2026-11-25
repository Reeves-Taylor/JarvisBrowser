let ws: WebSocket | undefined
let nextID = 0
const pending = new Map<number, { resolve: (value: any) => void, reject: (reason: Error) => void }>()
const listeners = new Map<string, ((params: any) => void)[]>

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
        socket.addEventListener("message", (e) => {
            const msg = JSON.parse(String(e.data))
            const entry = pending.get(msg.id)
            if (entry) {
                if (msg.error) entry.reject(new Error(msg.error.message))
                else entry.resolve(msg.result)
                pending.delete(msg.id)
            } else {
                const handlers = listeners.get(msg.method)
                if (handlers) for (const h of handlers) h(msg.params)
            }
        })
    })
}

export function send(method: string, params = {}) {
    if (ws === undefined) {
        throw new Error("WebSoket undefined.")
    } if (ws.readyState !== 1) {
        throw new Error("Ready State is not open.")
    }
    let id = nextID++
    return new Promise((resolve, reject) => {
        ws?.send(JSON.stringify({id, method, params}))
    })
}

export function recieve() {

}