const express = require('express')
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const app = express()
const cors = require('cors')
app.use(require('body-parser').json())
app.use(cors())

mongoose.connect('mongodb://localhost/notes', {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async () => {
  const Note = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }, 
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    } 
  })
  
  const Category = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  })

  Category.plugin(mongoosePaginate)
  Note.plugin(mongoosePaginate)

  await mongoose.model('Category', Category)
  await mongoose.model('Note', Note) 

  console.log('Connection to mongodb sucessfull')
})

app.get('/categories', async (req, res, next) => {
  try {
    if(req.query.limit) {
      options = {}
      if(req.query.page) {
        options.page = Number(req.query.page)
      }
      options.limit = Number(req.query.limit)

      const categories = await mongoose.model('Category').paginate({}, options)

      return res.status(200).json({
        ...categories
      })
    } else {
      const categories = await mongoose.model('Category').find({})

      return res.status(200).json({
        docs: categories
      })
    }
  } catch(error) {
    return next(error)
  }
})

app.post('/categories', async (req, res, next) => {
  try {
    const category = new mongoose.model('Category')({
      ...req.body
    })
    await category.save()
  
    return res.status(200).json({
      category
    })
  } catch(error) {
    return next(error)
  }
})

app.put('/categories/:id', async (req, res, next) => {
  try {
    const category = await mongoose.model('Category').findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
  
    if(!category) {
      return res.status(400).json({
        message: 'category not found'
      })
    }
  
    return res.status(200).json({
      category
    })
  } catch(error) {
    return next(error)
  }
})

app.delete('/categories/:id', async (req, res, next) => {
  try {
    const category = await mongoose.model('Category').remove({_id: req.params.id})

    return res.status(200).json({
      _id: req.params.id
    })
  } catch(error) {
    return next(error)
  }
})

app.get('/notes', async (req, res, next) => {
  try {
    if(req.query.limit) {
      options = {}
      if(req.query.page) {
        options.page = Number(req.query.page)
      }
      options.limit = Number(req.query.limit)

      const notes = await mongoose.model('Note').paginate(searchQuery, options)

      return res.status(200).json({
        docs: notes
      })
    } else {
      const notes = await mongoose.model('Note').find({})

      return res.status(200).json({

      })
    }
  } catch(error) {
    return next(error)
  }
})

app.post('/notes', async (req, res, next) => {
  try {
    const note = new mongoose.model('Note')({
      ...req.body
    })
    await note.save()
  
    return res.status(200).json({
      note
    })
  } catch(error) {
    return next(error)
  }
})

app.put('/notes/:id', async (req, res, next) => {
  try {
    const note = await mongoose.model('Note').findOneAndUpdate({_id: req.params.id}, body, {new: true})
  
    if(!note) {
      return res.status(400).json({
        message: 'Note not found'
      })
    }
  
    return res.status(200).json({
      category
    })
  } catch(error) {
    return next(error)
  }
})

app.delete('/notes/:id', async (req, res, next) => {
  try {
    const note = await mongoose.model('Note').remove({_id: req.params.id})

    return res.status(200).json({
      _id: req.params._id
    })
  } catch(error) {
    return next(error)
  }
})

app.post('/reset', async (req, res) => {
  try {
    await mongoose.model('Note').remove({})
    await mongoose.model('Category').remove({})
    
    return res.status(200).json({message: 'done'})
  } catch(error) {
    return next(error)
  }
})

app.listen(3000, () => {
  console.log('listening on port 3000!')
})