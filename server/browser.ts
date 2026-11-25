import puppeteer from "puppeteer"

export var proc: Bun.Subprocess

export default async function startBrowser() {
    const path = await puppeteer.executablePath()
    const file = Bun.file(await path);

    if (!(await file.exists())) {
        throw new Error(`File not found: ${path}`);
        process.exit(1)
    }

    const proc = Bun.spawn([
        await path,
        "--remote-debugging-port=9222",
        `--user-data-dir=${import.meta.dir}/secrets/profile`,
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