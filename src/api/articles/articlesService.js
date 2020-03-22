const articleRoutes =  server => {
  fs = require('file-system')
  // variables
  const dataPath = './src/data/articles.json'

  // helper methods
  const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err
      }

      callback(returnJson ? JSON.parse(data) : data)
    })
  }

  const writeFile = (fileData, callback,  filePath = dataPath, encoding = 'utf8') => {
    
    fs.writeFile(filePath, fileData, { encoding }, (err) => {
        
      if (err) {
        throw err
      }

      callback()
    },)
  }

  // READ
  server.get('/articles/:id', (req, res) => {
    const articleId = req.params['id']

    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err
      }

      const lista = JSON.parse(data || [])
      const item = lista.find(x => x.id == articleId)

      if (item) {
        res.send(item)
      } else {
        res.status(200).send({ message: `articles id:${articleId} not found` })
      }
    })
  })

  // READ
  server.get('/articles', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err
      }
      const {author_id} = req.query
      
      let lista = JSON.parse(data || [])
      if(author_id)
        lista = lista.filter(x => x.author_id == author_id)

      if (lista) {
        res.send(lista)
      } else {
        res.status(200).send({ message: `articles not found` })
      }
      
    },true)
  })
  // CREATE
  server.post('/articles', (req, res) => {
    readFile(data => {
       
       const id = Math.max.apply(null, data.map(x=> x.id )) + 1;
       const dateCreated = new Date().toJSON();
       
        // add the new article        
        const newArticle = {
            id: id,
            title: req.body.title,
            intro: req.body.intro,
            content: req.body.content,
            author_id: 2,
            dates: {
              created: dateCreated,
              updated: dateCreated
            }
        }
        
        data.push(newArticle)

        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send({ newArticle, message: 'new article added'})
        })
    }, true)
  })

  // UPDATE
  server.put('/articles/:id', (req, res) => {
    readFile(data => {
        
        // add the new article
        const articleId = req.params['id']
        const body = req.body
        
        const lista = data || []
        
        //Find index of specific object using findIndex method.
        let objIndex = lista.findIndex(obj => obj.id == articleId)     
        
        lista[objIndex].title = body.title,
        lista[objIndex].intro = body.intro,
        lista[objIndex].content = body.content,
        lista[objIndex].author_id = body.author_id,
        lista[objIndex].dates.updated = new Date().toJSON()

        const updatedObject = lista[objIndex]
        
        writeFile(JSON.stringify(lista, null, 2), () => {     

            res.status(200).send({ updatedObject, message: `articles id:${articleId} updated`})
        })
    }, true)
  })

  // DELETE
  server.delete('/articles/:id',  (req, res) => {
      
    readFile(data => {
        // add the new article
        const articleId = req.params['id']
        let newList = data.filter(obj => obj.id != articleId)          

       return writeFile(JSON.stringify(newList, null, 2), () => {
            res.status(200).send({ message: `articles id:${articleId} removed`})
        })
    }, true)
  })
}

module.exports = articleRoutes
