const app = require('./app') // the actual express application
const config = require('./utils/config') // used to import environment variables
const logger = require('./utils/logger') // used to log output to console

// listen to the port identified in environment variable and log it to console
app.listen(config.PORT, () => {
  logger.info(`Server running on PORT ${config.PORT}`)
})