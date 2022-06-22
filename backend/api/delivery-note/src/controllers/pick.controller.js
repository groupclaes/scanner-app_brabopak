const boom = require('boom')
const oe = require('@groupclaes/oe-connector')
const { FastifyRequest, FastifyReply } = require('fastify')

const config = require('../config')

/**
 * POST /pick?dm={datamatrix}&pin={pin}&col={collies}&loc={location}
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
exports.post = async (request, reply) => {
  try {
    oe.configure(config.oeConnector)

    const datamatrix = request.query.dm
    const pin = request.query.pin
    const collies = request.query.col
    const location = request.query.loc

    const oeResponse = await oe.run('slshbra01b', [
      pin,
      'BRA',
      {
        data: [{
          action: 'PICK',
          docNum: datamatrix,
          collies,
          location
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
    throw boom.boomify(err)
  }
}