// var _ = require('underscore');
// var Movie = require('../models/movie');
// var User = require('../models/user');
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');

module.exports = function(app) {

  //pre handle user 预处理
  app.use(function(req, res, next) {
    var _user = req.session.user;
    // if (_user) {
    // 取消判断    当session中的user为空的时候, locals中的值也就变成空。
    // 存到本地
    app.locals.user = _user;
    // }
    next();
  });

  // index
  app.get('/', Index.index);
  // User
  app.post('/user/signup', User.signup);
  app.post('/user/signin', User.signin);
  app.get('/logout', User.logout);
  app.get('/signin', User.showSignin);
  app.get('/signup', User.showSignup);
  app.get('/admin/userlist', User.userlist);
  // Movie
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie', Movie.admin);
  app.get('/admin/update/:id', Movie.update);
  app.get('/admin/movie/new', Movie.save);
  app.get('/admin/list', Movie.list);
  app.delete('/admin/list', Movie.del);

};
