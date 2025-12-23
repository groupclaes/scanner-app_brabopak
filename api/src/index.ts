import Fastify from '@groupclaes/fastify-elastic'
import { env } from 'node:process'

import { FastifyInstance } from 'fastify'
import deliveryNoteController from './controllers/delivery-note.controller'

const LOGLEVEL = 'debug'

/** Main loop */
export default async function main(config: any): Promise<FastifyInstance | undefined> {
  let fastify: FastifyInstance | undefined

  if (config) {
    if (!config.wrapper.mssql && config.mssql) {
      config.wrapper.mssql = config.mssql
    }
    if (!config.wrapper.fastify.requestLogging) {
      config.wrapper.fastify.requestLogging = true
    }
    fastify = await Fastify({ ...config.wrapper })
    const version_prefix = (env.APP_VERSION ? '/' + env.APP_VERSION : '')
    fastify.log.level = LOGLEVEL
    fastify.log.debug({ prefix: `${version_prefix}/${config.wrapper.serviceName}/delivery-note` }, 'fastify.register() deliveryNoteController')
    await fastify.register(deliveryNoteController, {
      prefix: `${version_prefix}/${config.wrapper.serviceName}/delivery-note`,
      logLevel: LOGLEVEL
    })
    await fastify.listen({ port: +(env['PORT'] ?? 80), host: '::' })
  }

  return fastify
}
