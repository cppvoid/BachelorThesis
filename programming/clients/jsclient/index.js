const coap  = require('coap') // or coap
    , req   = coap.request('coap://localhost/cppvoid')

req.on('response', function(res) {
  console.log('finished')
})

req.end()