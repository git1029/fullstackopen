import React, { useState } from 'react'
import FormInput from './FormInput'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()

    handleLogin({ username, password })

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={login}>
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

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm