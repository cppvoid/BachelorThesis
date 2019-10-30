var coap        = require('coap')
  , server      = coap.createServer()

const json = {data: 'hallo'}


server.on('request', function(req, res) {
  res.end(JSON.stringify(json))
})

// the default CoAP port is 5683
server.listen(5683, function() {

})