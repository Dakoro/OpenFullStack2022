import PropTypes from 'prop-types'
const LoginForm = ({
  username,
  password,
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange
}) => {
  return (
    <div>
      <h2>Log in the application</h2>
      <form onSubmit={handleSubmit}>
        <label>Username
          <input id='username' value={username} onChange={handleUsernameChange} />
        </label><br/>
        <label>Password
          <input id='password' value={password} type="password" onChange={handlePasswordChange} />
        </label><br/>
        <button id='login-button' type="submit">Login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm