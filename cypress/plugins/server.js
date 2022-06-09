const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const path = require('path')

const httpPorts = [3500, 3501]

const createApp = (port) => {
  const app = express()

  app.set('port', port)

  app.set('view engine', 'html')

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(bodyParser.raw())

  app.head('/', (req, res) => {
    return res.sendStatus(200)
  })

  app.get('/', (req, res) => {
    return res.send('<html><body>root page</body></html>')
  })

    app.use(express.static(path.join(__dirname, '..')))

  return app
}

httpPorts.forEach((port) => {
  const app = createApp(port)
  const server = http.Server(app)

  return server.listen(app.get('port'), () => {
    // eslint-disable-next-line no-console
    return console.log('Express server listening on port', app.get('port'))
  })
})
