import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

import oe from '@groupclaes/oe-connector'

declare module 'fastify' {
  export interface FastifyReply {
    success: (data?: any, code?: number, executionTime?: number) => FastifyReply
    fail: (data?: any, code?: number, executionTime?: number) => FastifyReply
    error: (message?: string, code?: number, executionTime?: number) => FastifyReply
  }
}

export default async function (fastify: FastifyInstance) {
  fastify.post('/:document_type', async function (request: FastifyRequest<{
    Params: {
      document_type: 'pick' | 'ship'
    }, Querystring: {
      dm: string
      pin: string
      col?: string
      loc?: string
    }
  }>, reply: FastifyReply) {
    try {
      oe.configure({
        c: false
      })

      let payload: any = {
        data: [{
          action: request.params.document_type.toUpperCase(),
          docNum: request.query.dm
        }]
      }

      if (request.params.document_type === 'pick') {
        payload.data[0].collies = request.query.col
        payload.data[0].location = request.query.loc
      }

      const oeResponse = await oe.run('slshbra01b', [
        request.query.pin,
        'BRA',
        payload
      ], {
        tw: 5000,
        simpleParameters: true
      })

      if (oeResponse && oeResponse.status === 200) {
        if (oeResponse.result) {
          return oeResponse.result
        } else {
          return reply
            .code(204)
            .send()
        }
      }

      return reply
        .code(oeResponse.status)
        .send(oeResponse)
    } catch (err) {
      return reply
        .status(500)
        .send(err)
    }
  })
}