// var _ = require('underscore');
// var Movie = require('../models/movie');
// var User = require('../models/user');
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

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

  app.get('/hasUser', User.hasUser);
  app.get('/noUser', User.noUser);
  app.get('/wrongPwd', User.wrongPwd);
  app.get('/logout', User.logout);
  app.get('/signin', User.showSignin);
  app.get('/signup', User.showSignup);
  // 登录，管理员权限 用户管理页面
  app.get('/admin/user/update/:id', User.signinRequired, User.adminRequired, User.update);
  app.post('/admin/user/new', User.signinRequired, User.adminRequired, User.save);
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist);
  app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.del);

  app.get('/admin/contact', User.signinRequired, User.adminRequired, User.contact);

  // Movie
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.admin);
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.save);
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

  // comment
  app.post('/user/comment', User.signinRequired, Comment.save);

  // Category
  app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
  app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
  app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
};
