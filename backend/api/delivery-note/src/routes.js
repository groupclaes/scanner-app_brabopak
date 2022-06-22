// Import controllers
const pickController = require('./controllers/pick.controller')
const shipController = require('./controllers/ship.controller')

module.exports = routes = [{
  method: 'POST',
  url: '/pick',
  handler: pickController.post
}, {
  method: 'POST',
  url: '/ship',
  handler: shipController.post
}]