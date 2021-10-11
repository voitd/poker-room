const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')

const app = express()

const httpServer = http.createServer(app)

const socketServer = socketIO(httpServer, { cors: { origin: '*' } })

app.use(express.json({ extended: false}))

app.use(cors({origin: true, credentials: true}))

app.use('/api/users', userRoutes)
