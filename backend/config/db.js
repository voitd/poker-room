const  mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrLParser: true,
      userCreateIndex: true,
    })
    console.log('[DB]: Connected!')
  } catch (error) {
    console.error(error.message); // eslint-disable-line no-console
    process.exit(1)
  }
}

module.exports = connectDB
