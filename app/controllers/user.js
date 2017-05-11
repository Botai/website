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
