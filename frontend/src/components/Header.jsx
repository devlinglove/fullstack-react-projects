import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useSocket } from '../contexts/SocketIOContext.jsx'
import { User } from './User.jsx'

export function Header() {
  const [token, setToken] = useAuth()
  const { socket } = useSocket()

  let acceessToken = token || localStorage.getItem('token')

  const handleLogout = () => {
    socket.disconnect()
    setToken(null)
    localStorage.removeItem('token')
  }

  if (acceessToken) {
    const { sub } = jwtDecode(acceessToken)
    return (
      <div>
        Logged in as <User id={sub} />
        <br />
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      <Link to='/login'>Log In</Link> | <Link to='/signup'>Sign Up</Link>
    </div>
  )
}
