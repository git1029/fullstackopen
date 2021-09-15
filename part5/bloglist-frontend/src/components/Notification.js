import React from 'react'

const Notification = ({ message }) => {
  if (message === null) return null

  const messageStyle = {
    color: message.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: message.type === 'error' ? 'red' : 'green',
    borderWidth: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={messageStyle}>
      {message.text}
    </div>
  )
}

export default Notification