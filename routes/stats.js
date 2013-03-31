module.exports = function(app){
  app.get('/stats', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    return res.render('stats/index')
  })
}