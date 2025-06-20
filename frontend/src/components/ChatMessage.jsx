import PropTypes from 'prop-types'

export function ChatMessage({ username, message }) {
  console.log('message', message)
  return (
    <div>
      <b>{username}</b>: {message}
    </div>
  )
}

ChatMessage.propTypes = {
  username: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
}
