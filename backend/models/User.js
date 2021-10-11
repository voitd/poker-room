const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  chips: {
    type: Number,
    default: 1000,
  },
  image: {
    type: String,
    default: './img/user.png'
  },
})


User.methods.matchPassword = async (enteredPassword) => await bcrypt.compare(enteredPassword, this.password)

module.exports = mongoose.model('User', User)

