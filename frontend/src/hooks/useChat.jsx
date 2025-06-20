import { useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketIOContext'

export function useChat() {
  const { socket } = useSocket()
  const [messages, setMessages] = useState([])

  function receiveMessage(message) {
    setMessages((messages) => [...messages, message])
  }

  function sendMessage(message) {
    socket.emit('chat.message', message)
  }

  useEffect(() => {
    socket.on('chat.message', receiveMessage)

    return () => socket.off('chat.message', receiveMessage)
  }, [])

  return { messages, sendMessage }
}
