require('dotenv').config() // make sure node is able to environment variables created in .env file by dotenv lib

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL

module.exports = {
  MONGODB_URL,
  PORT
}