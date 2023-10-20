import { log } from 'node:console'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

const server = createServer((req, res) => {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  })

  res.end('hey there!!')
})

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: false,
  },
})

io.on('connection', (socket) => {
  log('connection', socket.id)
  socket.on('join-room', (roomId, userId) => {
    //  adiciona os usuários na mesma sala
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('disconnect', () => {
      log('disconnected!', roomId, userId)
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

const serverStart = () => {
  const { address, port } = server.address()
  console.info(`app running at ${address}:${port}`)
}

server.listen(process.env.PORT || 3000, serverStart)
