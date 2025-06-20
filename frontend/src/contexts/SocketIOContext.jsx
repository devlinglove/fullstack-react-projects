import { createContext, useState, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import PropTypes from 'prop-types'
import { useAuth } from './AuthContext.jsx'

export const SocketIOContext = createContext({
  socket: null,
  status: 'waiting',
  error: null,
})

export const SocketIOContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [status, setStatus] = useState('waiting')
  const [error, setError] = useState(null)
  const [token] = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    if (token || window.localStorage.getItem('token')) {
      const socket = io(import.meta.env.VITE_SOCKET_HOST, {
        query: window.location.search.substring(1),
        auth: { token: token || window.localStorage.getItem('token') },
      })

      socketRef.current = socket

      socket.on('connect', () => {
        setStatus('connected')
        setError(null)
        console.log('connected to socket.io as', socket.id)
      })
      socket.on('connect_error', (err) => {
        setStatus('error')
        setError(err)
      })
      socket.on('disconnect', () => setStatus('disconnected'))
      setSocket(socket)
    }

    return () => {
      //setSocket(null)
      socketRef.current?.disconnect()
      socketRef.current = null // Reset the ref
      //setStatus('waiting')
    }
  }, [token])

  return (
    <SocketIOContext.Provider value={{ socket, status, error }}>
      {children}
    </SocketIOContext.Provider>
  )
}

SocketIOContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}

export function useSocket() {
  return useContext(SocketIOContext)
}
