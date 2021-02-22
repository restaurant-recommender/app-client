import { Button } from 'antd'
import io from 'socket.io-client'
import { urls } from '../../services'

export default function SocketTestPage () {

  const socket = io(urls.app_server, {
    transports: ['websocket'],
  })

  socket.on('test', (msg) => {
    console.log(msg)
  })

  const handleTest = () => {
    console.log(socket)
    console.log('broadcasted')
    socket.emit('test', 'test')
  }

  return (
    <>
      {socket.toString()}
      <Button onClick={handleTest}>Test</Button>
    </>
  )
}