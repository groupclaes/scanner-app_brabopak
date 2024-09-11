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
      pal?: string
      pal2?: string
      wght?: string
      wpa?: string
      tb?: string
    }
  }>, reply: FastifyReply) {
    request.log.debug({ ...request.query, ...request.params }, 'params')
    try {
      oe.configure({
        c: false
      })

      let payload: any = {
        data: [{
          action: request.params.document_type.toUpperCase(),
          docNum: request.query.dm.replaceAll(' ', '').replaceAll('%20', '').replaceAll('%C2%A0', '')
        }]
      }

      if (request.params.document_type === 'pick') {
        payload.data[0].collies = request.query.col
        payload.data[0].location = request.query.loc

        if (request.query.pal)
          payload.data[0].pallets = request.query.pal
        if (request.query.pal2)
          payload.data[0].pallets_half = request.query.pal2
        if (request.query.wght)
          payload.data[0].pallets_disposable = request.query.wpa
        if (request.query.tb)
          payload.data[0].total_weight = request.query.wght
        if (request.query.wpa)
          payload.data[0].bag_boxes = request.query.tb
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
        if (oeResponse.result)
          return oeResponse.result
        else
          return reply
            .code(204)
            .send()
      }

      return reply
        .code(oeResponse.status)
        .send(oeResponse)
    } catch (err) {
      request.log.error('unknown error while handling request.')
      return reply
        .status(500)
        .send(err)
    }
  })
}