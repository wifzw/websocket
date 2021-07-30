import express from 'express'
import http from 'http'

import socketio from 'socket.io'


const app = express()
const server = http.Server(app)

app.use(express.static(__dirname + '/public'))

const io = socketio(server)

let mensagens = []

io.on('connection', (socket) => {
    io.to(socket.id).emit({
        status: true,
        message: 'conexão estabelecida com o servidor'
    })


    console.log('mensagens => ', mensagens)

    socket.emit('previousMessages', mensagens)

    socket.on('SendMessage', data => {
        console.log('Mensagem Recebida => ',data)
        mensagens.push({id: socket.id, usuario: data.usuario, mensagem: data.mensagem})

        console.log('Mensagens => ', mensagens)
        socket.broadcast.emit('receivedMessage', {id: socket.id, usuario: data.usuario, mensagem: data.mensagem})

    })

    socket.on('deleteMessage', () => {
        mensagens.splice(0, 1)
    })
})


app.get('/', (req, res) => {
    res.render('index.html')
})


app.get('*', (req, res) => {
    res.send('Desculpe!! Essa rota não existe.'.toLocaleUpperCase());
})

server.listen(3333, () => {
    console.log('SERVIDOR INICIADO PORTA: ', 3333)
})