var _ = require('underscore');
var User = require('../models/user');
var express = require('express');
var app = express();
var fs = require('fs');


exports.showSignup = function(req, res) {
  res.render('signup', {
      title: '注册页面'
  });
};

exports.showSignin = function(req, res) {
  res.render('signin', {
      title: '登录页面'
  });
};

exports.hasUser = function(req, res) {
  res.render('hasUser', {
      title: '用户已存在'
  });
};

exports.noUser = function(req, res) {
  res.render('noUser', {
      title: '用户不存在'
  });
};

exports.wrongPwd = function(req, res) {
  res.render('wrongPwd', {
      title: '密码错误'
  });
};
// signup
exports.signup = function(req, res) {
  var _user = req.body.user;

  User.findOne({name: _user.name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (user) {
      return res.redirect('/hasUser');
    } else {
      user = new User(_user);
      user.save(function(err, user) {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
      });

    }
  });
  //  console.log(_user);
};


//  signin
exports.signin = function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: _user.name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.redirect('/noUser');
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        user.lastSignin = Date.now();
        //保持状态   req.session
        req.session.user = user;

        return res.redirect('/');
      } else {
        console.log('not matched');
        return res.redirect('/wrongPwd');
      }

    });

  });
};

// logout
exports.logout = function(req, res) {

  delete req.session.user;
  // delete app.locals.user;
  res.redirect('/');
};

// admin update
exports.update = function(req, res) {
    var id = req.params.id;

    if(id) {
        User.findById(id, function(err, user) {
            res.render('updateUser', {
                title: '后台更新',
                user: user
            });
        });
    }
};
// admin post users
exports.save = function(req, res) {
    var id = req.body.user._id;
    var userObj = req.body.user;
    var _user;

    if(id !== 'undefined') {
        User.findById(id, function(err, user) {
            if(err) {
                console.log(err);
            }

            _user = _.extend(user, userObj);
            _user.save(function(err, user) {
                if(err) {
                    console.log(err);
                }

                res.redirect('/admin/user/list');
            });
        });
    }else {
        _user = new User({
            name: userObj.name,
            role: userObj.role
        });

        _user.save(function(err, user) {
            if(err) {
                console.log(err);
            }

            res.redirect('/user/' + user._id);
        });
    }

};

// list delete user
exports.del = function(req, res) {
    var id = req.query.id;
    if(id) {
        User.remove({_id: id}, function(err, user) {
            if(err) {
                console.log(err);
            }else {
                res.json({success: 1});
            }
        });
    }
};

// userlist page
exports.userlist = function(req, res) {

  User.fetch(function(err, users) {
      if(err) {
          console.log(err);
      }

      res.render('userlist', {
          title: '用户列表页',
          users: users
      });
  });

};

// midware for user signin
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/signin');
  }
  next();
};

// midware for user admin
exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  if (user.role <= 10) {
    return res.redirect('/signin');
  }
  next();
};


//contact me

var file = "./app/data/test.json";

exports.contact = function(req, res) {
  var data = JSON.parse(fs.readFileSync(file));

  res.render('contact', {
      title: '联系我',
      data: data
  });
};
