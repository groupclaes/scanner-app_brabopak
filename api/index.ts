import server from './src'

const cfg = require('./config')
const SIGNALS = ['SIGTERM', 'SIGINT']

const main = async function() {
  const fastify = await server(cfg)

  SIGNALS.forEach(function onSignal(signal) {
    process.on(signal, async function handleSignal() {
      await fastify?.close()
      process.exit(0)
    })
  })
}

main().then()
