const articleRoutes = require('../api/articles/articlesService')

module.exports = function (server) {  
  articleRoutes(server)
}
