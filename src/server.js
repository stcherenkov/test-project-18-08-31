const express = require('express')

const config = require('./config')
const loggers = require('./loggers')

const logger = loggers.get('server')

const app = express()

app.set('view engine', 'hbs')
const hbs = require('hbs')

hbs.registerHelper('localUrl', (path) =>
  `/${config.get('server.context')}/${path}`.replace(/\/+/g, '/')
)
hbs.registerHelper('staticUrl', (path) =>
  `/${config.get('static.context')}/${path}`.replace(/\/+/g, '/')
)

// log every http request with response time
app.use(loggers.expressHTTP)

app.use('/static', express.static('static'))
app.use(
  '/api',
  [
    require('./api-protection'),
    require('./routes/api')
  ]
)
app.use('/', require('./routes/pages'))

// log every unhandled error
app.use(loggers.expressError)

app.listen(
  config.get('server.port'),
  () => {
    logger.info(`Server started on port ${config.get('server.port')}`)
  }
)
