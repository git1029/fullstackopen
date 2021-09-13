// Error constructor to handle custom validation errors
function ValidationError(message) {
  this.name = 'ValidationError',
  this.message = message
}

// Error constructor to handle custom authentication errors
function AuthenticationError(message) {
  this.name = 'AuthenticationError',
  this.message = message
}

module.exports = {
  ValidationError,
  AuthenticationError
}