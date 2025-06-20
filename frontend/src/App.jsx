import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
// import { Root } from './pages/Root.jsx'

import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { SocketIOContextProvider } from './contexts/SocketIOContext.jsx'

import './App.css'
import { Chat } from './pages/Chat.jsx'

function App() {
  const queryClient = new QueryClient()

  // eslint-disable-next-line no-undef
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Chat />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
  ])

  // const socket = io(import.meta.env.VITE_SOCKET_HOST, {
  //   query: window.location.search.substring(1),
  //   auth: { token: window.localStorage.getItem('token') },
  // })

  // socket.on('connect', async () => {
  //   console.log('connected to socket.io as', socket.id)
  //   socket.emit('chat.message', 'hello from client')
  //   const userInfo = await socket.emitWithAck('user.info', socket.id)
  //   console.log('user info', userInfo)
  // })

  // socket.on('connect_error', (err) => {
  //   console.error('socket.io connect error:', err)
  // })

  // socket.on('chat-message', (msg) => {
  //   console.log(`${msg.username}: ${msg.message}`)
  // })

  // useEffect(() => {
  //   localStorage.setItem(
  //     'token',
  //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3NTAzMzQ1MTgsImV4cCI6MTc4MTg3MDUxOCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiNjg0YTdhMDNhNTI4ZGFiNWJiMzJmZjc3IiwiR2l2ZW5OYW1lIjoiSm9obm55IiwiU3VybmFtZSI6IlJvY2tldCIsIkVtYWlsIjoianJvY2tldEBleGFtcGxlLmNvbSIsIlJvbGUiOlsiTWFuYWdlciIsIlByb2plY3QgQWRtaW5pc3RyYXRvciJdfQ.akAarifNYkvFteJqUROOdmmCy-pAa6sA9tnZXUQ8u1o',
  //   )
  // }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SocketIOContextProvider>
          <RouterProvider router={router} />
        </SocketIOContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}

export default App
