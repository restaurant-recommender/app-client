import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { urls } from '../services'

export const useSocket = (url=urls.app_server) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketIo = io(url, {
        transports: ['websocket'],
    })

    setSocket(socketIo)

    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup

    // should only run once and not on every re-render,
    // so pass an empty array
  }, [])

  return socket
}