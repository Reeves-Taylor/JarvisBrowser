import puppeteer from "puppeteer"

export var proc: Bun.Subprocess

export default async function startBrowser() {
    const file = Bun.file(await puppeteer.executablePath());

    if (!(await file.exists())) {
        throw new Error(`File not found: ${await puppeteer.executablePath()}`);
        process.exit(1)
    }

    proc = Bun.spawn([await puppeteer.executablePath(), "--remote-debugging-port=9222", "--user-data-dir='/secrets/profile'", "--no-first-run", "--no-default-browser-check"])
}