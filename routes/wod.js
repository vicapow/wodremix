

module.exports = function(app){
  app.get('/wod/log', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    return res.render('workout/log')
  })
}