// Import controllers
const pickController = require('./controllers/pick.controller')
const shipController = require('./controllers/ship.controller')

module.exports = routes = [{
  method: 'POST',
  url: '/delivery-note/pick',
  handler: pickController.post
}, {
  method: 'POST',
  url: '/delivery-note/ship',
  handler: shipController.post
}]