import puppeteer from "puppeteer"
import { join } from "node:path"

export let proc: Bun.Subprocess

export default async function startBrowser() {
    const exepath = await puppeteer.executablePath()
    const file = Bun.file(exepath);

    if (!(await file.exists())) {
        throw new Error(`File not found: ${exepath}`);
    }

    proc = Bun.spawn([
        exepath,
        "--remote-debugging-port=9222",
        `--user-data-dir=${join(import.meta.dir, "..", "secrets", "profile")}`,
        "--no-first-run",
        "--no-default-browser-check",
    ]);
    const deadline = Date.now() + 10000
    let res: Response | undefined
    while (Date.now() < deadline && proc.exitCode == null) {
        try {
            res = await fetch("http://127.0.0.1:9222/json/version")
            if (res.ok) break
    } catch {}
    await Bun.sleep(200)
    }

    if (!res?.ok) {
        throw new Error("Chromium debug port did not open")
    }

    const targets = await (await fetch("http://127.0.0.1:9222/json")).json() as { type: string, webSocketDebuggerUrl?: string }[]
    const page = targets.find(t => t.type === "page")
    if (!page?.webSocketDebuggerUrl) {
        throw new Error("No page target found")
    }
    const url = page.webSocketDebuggerUrl
    return url
}