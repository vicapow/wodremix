

module.exports = function(app){
  app.get('/wod', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    return res.render('workout/complete')
  })
}