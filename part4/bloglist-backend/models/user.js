const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true,
    match: [/^[a-zA-Z0-9_-]+$/, '{VALUE} is not a valid username'],
    minLength: [3, '`username` must be at least 3 characters']
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

// Custom validator to check for username uniqueness
// NB: mongoose-unique-validator requires mongoose < v6
// NB: this will be called using save()
userSchema.path('username').validate(async (value) => {
  const user = await User.findOne({
    username: value
  })
  return !user
}, '`username` must be unique')

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User