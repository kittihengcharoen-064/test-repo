import { config } from "dotenv"
import express from "express"
import http from "http"
import cors from "cors"

import { createPool } from "mysql2/promise"

config()

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const db = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

app.use(cors())
app.use(express.json())

app.use("/healthcheck", (_, res) => res.status(200).end())

app.get("/message", (_, res) => {
    res.json({ message: "กำลังสร้างมองข้ามไปก่อน" })
})

app.get("/status", async (_, res) => {
    try {
        db.ping((err) => {
            if (err) res.status(500).json({ error: true, message: err })
            res.json({ error: false, message: "DB is online!" })
        })
    } catch (error) {
        res.status(500).json({ error: true, message: error?.message || "Unexpected Error" })
    }
})

server.listen(PORT, () => {
    console.log(`Initial Backend is online on port ${PORT}`)
})