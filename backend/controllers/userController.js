const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const generateToken = require('../config/generateToken')

exports.authUser = asyncHandler(async(req, res) => {
  const {email, password} = req.body
   
  const user = await User.findOne({email})

  const isMatchPass = await user.manchPassword(password)

  if (user && isMatchPass) {
    res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    chips: user.chips,
    token: generateToken(user._id)
    })
  } else {
    res.status(401)
    
    throw new Error('Wrong email or password')
  }

})
