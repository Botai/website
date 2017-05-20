var _ = require('underscore');
var User = require('../models/user');
var express = require('express');
var app = express();


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


// signup
exports.signup = function(req, res) {
  var _user = req.body.user;

  User.findOne({name: _user.name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (user) {
      return res.redirect('/signin');
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
      return res.redirect('/signup');
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        //保持状态   req.session
        req.session.user = user;

        return res.redirect('/');
      } else {
        console.log('not matched');
        return res.redirect('/signin');
      }

    });

  });
};

// logout
exports.logout = function(req, res) {

  delete req.session.user;
  // delete app.locals.user;
  res.redirect('/signin');
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

        _user.save(function(err, movie) {
            if(err) {
                console.log(err);
            }

            res.redirect('/user/' + user._id);
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
