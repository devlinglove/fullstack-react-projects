import { useSocket } from '../contexts/SocketIOContext'

export function Status() {
  const { error, status } = useSocket()

  return (
    <div>
      Socket status: <b>{status}</b>
      {error && <i> - {error.message}</i>}
    </div>
  )
}
