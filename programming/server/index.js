const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const coap        = require('coap')
const server      = coap.createServer()
const bl          = require('bl')

mongoose.connect('mongodb://localhost/notes', {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async () => {
  const Note = new mongoose.Schema({
    title: String,
    text: String,
    category: mongoose.Schema.Types.ObjectId
  })
  
  const Category = new mongoose.Schema({
    name: String
  })

  Category.plugin(mongoosePaginate)
  Note.plugin(mongoosePaginate)

  await mongoose.model('Category', Category)
  await mongoose.model('Note', Note) 

  console.log('Connection to mongodb sucessfull')
})

server.on('request', function(req, res) {
  try {
    if(req.method === 'GET') {
      return handleGetRequests(req, res, getPath(req.url), getQuery(req.url))
    } 
    if(req.method === 'POST') {
      return handlePostRequests(req, res)
    }
      
    res.code = 404
    return res.end()
  } catch(error) {
    console.log(error)
  }
})  

// the default CoAP port is 5683
server.listen(5683, function() {

})

const handleGetRequests = async (req, res, path, query) => { 
  if(path === '/categories') {
    const options = {
      limit: 5
    }
    if(query) {
      options.page = Number(query.page)
    }
    
    const categories = await mongoose.model('Category').paginate({}, options)
    
    return res.end(JSON.stringify({
      ...categories
    }))
  }

  res.code = 404
  return res.end()
}

const handlePostRequests = async (req, res) => {
  if(req.url === '/categories') {
      const category = new mongoose.model('Category')(JSON.parse(req.payload))
      await category.save()
    
      console.log(category)

      return res.end(JSON.stringify(category))
  }

  res.code = 404
  return res.end()
}

const getPath = (url) => {
  return url.split('?')[0]
} 

const getQuery = (url) => {
  const urlSplit = url.split('?')
  if(urlSplit.lenght === 1) {
    return {}
  }

  return urlSplit[1].split('&').reduce((obj, element) => {
    const keyAndValue = element.split('=')
    obj[keyAndValue[0]] = keyAndValue[1]
    return obj
  }, {})
}