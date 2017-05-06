var express = require('express');
var path = require('path');
var session = require('express-session');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var User = require('./models/user');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect');
var MongoStore = require('connect-mongo')(session);

var app = express();

var dbUrl = 'mongodb://localhost/webSite';

var port = process.env.PORT || 3000;

mongoose.connect(dbUrl);

app.set('views', './views/pages');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: 'website',
  store: new MongoStore({
    url: dbUrl,
    collection: 'sessions',
  }),

}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.locals.moment = require('moment');

app.listen(port);

console.log('server is start on port '+ port);

// index page
app.get('/', function(req, res) {
    console.log(req.session.user);

    var _user = req.session.user;
    // if (_user) {
    // 取消判断 这样当session中的user为空的时候, locals中的值也就随之变成空。
    // 存到本地
    app.locals.user = _user;
    // }
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }

        res.render('index', {
            title: '首页',
            movies: movies
        });
    });
});
// signup
app.post('/user/signup', function(req, res) {
  var _user = req.body.user;

  User.findOne({name: _user.name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (user) {
      return res.redirect('/');
    } else {
      user = new User(_user);
      user.save(function(err, user) {
        if (err) {
          console.log(err);
        }
        res.redirect('/admin/userlist');
      });

    }
  });

  //  console.log(_user);
});
//  signin
app.post('/user/signin', function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: _user.name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.redirect('/');
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
        return res.redirect('/');
      }

    });

  });
});

// logout
app.get('/logout', function(req, res) {

  delete req.session.user;
  // delete app.locals.user;
  res.redirect('/');
});



// userlist page
app.get('/admin/userlist', function(req, res) {
    User.fetch(function(err, users) {
        if(err) {
            console.log(err);
        }

        res.render('userlist', {
            title: '用户列表页',
            users: users
        });
    });

});


// detail page
app.get('/movie/:id', function(req, res) {
    var id = req.params.id;
    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: '详情页' + movie.title,
            movie: movie
        });
    });
});

// admin page
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: '后台',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            flash: '',
            language: '',
            summary: ''
        }
    });
});
// admin update
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;

    if(id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: '后台更新',
                movie: movie
            });
        });
    }
});




// admin post movie
app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if(id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if(err) {
                console.log(err);
            }

            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if(err) {
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id);
            });
        });
    }else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            summary: movieObj.summary,
            poster: movieObj.poster,
            flash: movieObj.flash
        });

        _movie.save(function(err, movie) {
            if(err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);
        });
    }

});


// list page
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }

        res.render('list', {
            title: '列表页',
            movies: movies
        });
    });

});

// list delete movie
app.delete('/admin/list', function(req, res) {
    var id = req.query.id;
    if(id) {
        Movie.remove({_id: id}, function(err, movie) {
            if(err) {
                console.log(err);
            }else {
                res.json({success: 1});
            }
        });
    }
});
