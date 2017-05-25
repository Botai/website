var _ = require('underscore');
var Movie = require('../models/movie');
var Comment = require('../models/comment');

// detail page
exports.detail = function(req, res) {
  var id = req.params.id;
  Movie.findById(id, function(err, movie) {
    // 异步获取 电影详情  + 评论 （方法一）
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .exec(function(err, comments) {
        //console.log(comments);
        res.render('detail', {
          title: '详情页' + movie.title,
          movie: movie,
          comments: comments
        });
      })
  });
};

// admin page
exports.admin = function(req, res) {
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
};

// admin update
exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: '后台更新',
        movie: movie
      });
    });
  }
};

// admin post movie
exports.save = function(req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;

  if (id !== 'undefined') {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err);
      }

      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err);
        }

        res.redirect('/movie/' + movie._id);
      });
    });
  } else {
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
      if (err) {
        console.log(err);
      }

      res.redirect('/movie/' + movie._id);
    });
  }

};

// list page
exports.list = function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }

    res.render('list', {
      title: '列表页',
      movies: movies
    });
  });

};

// list delete movie
exports.del = function(req, res) {
  var id = req.query.id;
  if (id) {
    Movie.remove({
      _id: id
    }, function(err, movie) {
      if (err) {
        console.log(err);
      } else {
        res.json({success: 1});
      }
    });
  }
};
