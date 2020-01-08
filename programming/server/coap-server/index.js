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

server.on('request', async (req, res) => {
  try {
    if(req.method === 'GET') {
      return handleGetRequests(req, res, getPath(req.url), getQuery(req.url))
    } 
    else if(req.method === 'POST') {
      return handlePostRequests(req, res)
    }
    else if(req.method === 'PUT') {
      return handlePutRequest(req, res)
    }
    else if(req.method === 'DELETE') {
      return handleDeleteRequest(req, res)
    } else {
      res.code = 404
      return res.end()
    }
  } catch(error) {
    console.log(error)
    res.code = 500
    return res.end()
  }
})  

// the default CoAP port is 5683
server.listen(5683, function() {

})

const handleGetRequests = async (req, res, path, query) => { 
  try {
    if(path === '/categories') {
      const options = {}
      if(query && query.page) {
        options.page = Number(query.page)
      }
      if(query && query.limit) {
        options.limit = Number(query.limit)
      }
    
      if(options.limit) {
        const categories = await mongoose.model('Category').paginate({}, options)

        return res.end(JSON.stringify({
          ...categories
        }))
      } else {
        const categories = await mongoose.model('Category').find({})

        return res.end(JSON.stringify({
          docs: categories
        }))
      }
    }
    else if(path === '/notes') {
      const searchQuery = {}
      if(query && query.category) {
        searchQuery.category = query.category
      }
      const options = {}
      if(query && query.page) {
        options.page = Number(query.page)
      }
      if(query && query.limit) {
        options.limit = Number(query.limit)
      }

      if(options.limit) {
        const notes = await mongoose.model('Note').paginate(searchQuery, options)

        return res.end(JSON.stringify({
          ...notes
        }))
      } else {
        const notes = await mongoose.model('Note').find({})

        return res.end(JSON.stringify({
          docs: notes
        }))
      }
    } else {
      res.code = 404
      return res.end()
    }
  } catch(error) {
    console.log(error)
    res.code = 500
    return res.end()
  }
}

const handlePostRequests = async (req, res) => {
  try { 
    if(req.url === '/categories') {
      const category = new mongoose.model('Category')(JSON.parse(req.payload))
      await category.save()

      return res.end(JSON.stringify(category))
    }
    else if(req.url === '/notes') {
      const note = new mongoose.model('Note')(JSON.parse(req.payload))
      await note.save()

      return res.end(JSON.stringify(note))
    }
    else if(req.url === '/reset') {
      await mongoose.model('Note').remove({})
      await mongoose.model('Category').remove({})

      return res.end(JSON.stringify({message: 'done'}))
    } else {
      res.code = 404
      return res.end()
    }
  } catch(error) {
    console.log(error)
    res.code = 500
    return res.end() 
  }
}

const handlePutRequest = async (req, res) => {
  try {
    const url = req.url.split('/') 
    if(url[1] === 'categories') {
      const category = await mongoose.model('Category').findOneAndUpdate({_id: url[2]}, JSON.parse(req.payload), {new: true})
    
      if(!category) {
        res.code = 400
        return res.end()
      }
    
      return res.end(JSON.stringify(category))
    }
    else if(url[1] === 'notes') {
      const note = await mongoose.model('Note').findOneAndUpdate({_id: url[2]}, JSON.parse(req.payload), {new: true})
    
      if(!note) {
        res.code = 400
        return res.end()
      }
    
      return res.end(JSON.stringify(note))
    } else {
      res.code = 404
      return res.end()
    }
  } catch(error) {
    console.log(error)
    res.code = 500
    return res.end() 
  }
}

const handleDeleteRequest = async (req, res) => {
  try {
    const url = req.url.split('/') 
    if(url[1] === 'categories') {
      const category = await mongoose.model('Category').remove({_id: url[2]})

      if(!category) {
        res.code = 400
        return res.end()
      }

      return res.end(JSON.stringify({
        _id: url[2]
      }))
    }
    else if(url[1] === 'notes') {
      const note = await mongoose.model('Note').remove({_id: url[2]})

      if(!note) {
        res.code = 400
        return res.end()
      }

      return res.end(JSON.stringify({
        _id: url[2]
      }))
    } else {
      res.code = 404
      return res.end()
    }
  } catch(error) {
    console.log(error)
    res.code = 500
    return res.end() 
  }
}

const getPath = (url) => {
  return url.split('?')[0]
} 

const getQuery = (url) => {
  const urlSplit = url.split('?')
  if(urlSplit.length === 1) {
    return {}
  }
  
  return urlSplit[1].split('&').reduce((obj, element) => {
    const keyAndValue = element.split('=')
    obj[keyAndValue[0]] = keyAndValue[1]
    return obj
  }, {})
}