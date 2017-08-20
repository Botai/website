var _ = require('underscore');
var mongoose = require('mongoose')
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = mongoose.model('Category')

// detail page
exports.detail = function(req, res) {
  var id = req.params.id;
  Movie.findById(id, function(err, movie) {
    // 异步获取 电影详情  + 评论 （方法一）
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
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
  Category.find({}, function(err, categories) {
    res.render('admin', {
      title: '后台',
      categories: categories,
      movie: {}
    });
  });
};

// admin update
exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    Movie.findById(id, function(err, movie) {
      Category.find({}, function(err, categories) {
        res.render('admin', {
          title: '后台更新',
          movie: movie,
          categories: categories
        });
      })
    });
  }
};

// admin post movie

// exports.save = function(req, res) {
//   var id = req.body.movie._id;
//   var movieObj = req.body.movie;
//   var _movie;
//
//   if (id) {
//     Movie.findById(id, function(err, movie) {
//       if (err) {
//         console.log(err);
//       }
//
//       _movie = _.extend(movie, movieObj);
//       _movie.save(function(err, movie) {
//         if (err) {
//           console.log(err);
//         }
//
//         res.redirect('/movie/' + movie._id);
//       })
//     })
//   } else {
//     _movie = new Movie(movieObj)
//
//     var categoryId = movieObj.category
//     var categoryName = movieObj.categoryName
//
//     _movie.save(function(err, movie) {
//       if (err) {
//         console.log(err)
//       }
//       if (categoryId) {
//         Category.findById(categoryId, function(err, category) {
//           category.movies.push(movie._id)
//
//           category.save(function(err, category) {
//             res.redirect('/movie/' + movie._id)
//           })
//         })
//       } else if (categoryName) {
//         var category = new Category({
//           name: categoryName,
//           movies: [movie._id]
//         })
//
//         category.save(function(err, category) {
//           movie.category = category._id
//           movie.save(function(err, movie) {
//             res.redirect('/movie/' + movie._id)
//           })
//         })
//       }
//     })
//   }
//
// };

// 增加电影分类更换
exports.save = (req, res) => {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;

  if (id) {
    Movie.findById(id, (err, movie) => {
      if (err) {
        console.log(err);
        return;
      }
      /*_movie = _.extend(movie,movieObj);
      _movie.save((err,movie)=>{
        if(err) return handleError(err);
        res.redirect('/movie/'+movie._id);
      })*/
      var originCategoryId = movie.category.toString();
      Movie.findOneAndUpdate({ _id: id }, movieObj, { new: true }, (err, movie) => {
        if (err) {
          console.log(err);
          return;
        }
        if (originCategoryId === movie.category.toString()) {
          console.log('is equal');
        } else {
          Category.findById(originCategoryId, (err, category) => {
            if (err) {
              console.log(err);
              return;
            }
            category.movies.splice(category.movies.indexOf(movie._id),1);
            category.save((err,category)=>{
              if(err){
                console.log(err);
                return;
              }

            })
            Category.findById(movie.category.toString(), (err, category) => {
              if(err){
                console.log(err);
                return;
              }
              category.movies.push(movie);
              category.save((err,category)=>{
                if(err){
                  console.log(err);
                  return;
                }
              })
            })
          })
        }
        res.redirect('/movie/' + movie._id);
      });

    })
  } else {
    _movie = new Movie(movieObj);
    var categoryId = _movie.category;
    _movie.save((err, movie) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(categoryId);
      Category.findById(categoryId, (err, category) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(category);
        category.movies.push(movie);
        category.save((err, category) => {
          res.redirect('/movie/' + movie._id);
        })
      })
    })
  }
}
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
        res.json({success: 0});
      } else {
        res.json({success: 1});
      }
    });
  }
};
