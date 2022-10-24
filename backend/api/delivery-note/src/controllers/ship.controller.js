const oe = require('@groupclaes/oe-connector')
const { FastifyRequest, FastifyReply } = require('fastify')

const config = require('../config')

/**
 * POST /ship?dm={datamatrix}&pin={pin}
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
exports.post = async (request, reply) => {
  try {
    oe.configure(config.oeConnector)

    const datamatrix = request.query.dm
    const pin = request.query.pin

    const oeResponse = await oe.run('slshbra01b', [
      pin,
      'BRA',
      {
        data: [{
          action: 'SHIP',
          docNum: datamatrix
        }]
      }
    ])

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
}