import express from 'express'
import __dirname from './utils.js';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';

import viewsRouter from './routes/views.js'

const app = express();

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.use('/', viewsRouter)

let messages = [
];

const server = app.listen(8080, () => {
    console.log('Server ON')
})

const io = new Server(server)

io.on('connection', socket => {
    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data)
        io.emit('messageLogs', messages)
    })
})