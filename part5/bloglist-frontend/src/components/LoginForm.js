import React from 'react'
import FormInput from './FormInput'

const LoginForm = (props) => {
  const {
    handleLogin, 
    username, setUsername,
    password, setPassword
  } = props

  return (
    <form onSubmit={handleLogin}>
      <FormInput
        label='Username: '
        type='text'
        value={username}
        name='Username'
        onChange={({ target }) => setUsername(target.value)}
      />
      <FormInput
        label='Password '
        type='password'
        value={password}
        name='Password'
        onChange={({ target }) => setPassword(target.value)}
      />
      <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm