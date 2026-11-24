// Some helper functions for generating the password hash and secret for .env


import crypto from "crypto"

async function hashPassword(password: string) {
    if (password) {
        const password_hash = await Bun.password.hash(password)
        return password_hash
    }
    else {
        console.error("Could not read password")
    }
}

async function verifyPassword(password: string, password_hash: string) {
    return Bun.password.verify(password, password_hash)
}

function generateSecret() {
    const bytes = crypto.getRandomValues(new Uint8Array(48));
    const token = Buffer.from(bytes).toString("base64url");
    return token
}
