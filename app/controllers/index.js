var Category = require('../models/category');
var Movie = require('../models/movie');
var express = require('express');
var app = express();

exports.index = function(req, res) {
  Category.find({}).populate({
    path: 'movies',
    options: {
      limit: 5
    }
  }).exec(function(err, categories) {
    if (err) {
      console.log(err);
    }
    res.render('index', {
      title: '首页',
      categories: categories
    });
  });
};

exports.search = function(req, res) {
  var category_id = req.query.category_id;
  var query = req.query.query;
  var page = req.query.page;
  const itemsPerPage = 6;
  var index = page * itemsPerPage;

  if (category_id) {
    // 如果有分类id，则执行分类／分页
    var _category = Category.findOne({_id: category_id});
    _category.exec().then(function(category) {
      var totalPage = category.movies.length/2;
      console.log(1111111);
      console.log(totalPage);
      _category.populate({
        path: 'movies',
        options: {
          limit: itemsPerPage,
          skip: index
        }
      }).exec().then(function(category) {
        res.render('results', {
          title: '搜索结果页面',
          keyword: category.name,
          movies: category.movies,
          currentPage: page,
          query: 'category_id=' + category._id,
          totalPage: Math.ceil(totalPage / itemsPerPage)
        })
      }, function(err) {
        console.log(err)
      })
    }, function(err) {
      console.log(err)
    })
  } else {
    // 执行电影搜索，来自搜索框
    Movie.find({
      title: new RegExp('.*' + query + '.*')
    }, null, {
      limit: itemsPerPage,
      skip: index
    }).exec().then(function(movies) {
      res.render('results', {
        title: '搜索结果页面',
        keyword: query,
        query: 'query=' + query,
        currentPage: page,
        totalPage: 1,
        movies: movies
      })
    }, function(err) {
      console.log(err)
    })
  }

}

// search page
// exports.search = function(req, res) {
//   var catId = req.query.cat
//   var q = req.query.q
//   var page = parseInt(req.query.p, 10) || 0
//   var count = 2
//   var index = page * count
//
//   if (catId) {
//     Category
//       .find({_id: catId})
//       .populate({
//         path: 'movies',
//         select: 'title poster'
//       })
//       .exec(function(err, categories) {
//         if (err) {
//           console.log(err)
//         }
//         var category = categories[0] || {}
//         var movies = category.movies || []
//         var results = movies.slice(index, index + count)
//
//         res.render('results', {
//           title: '结果列表',
//           keyword: category.name,
//           currentPage: (page + 1),
//           query: 'cat=' + catId,
//           totalPage: Math.ceil(movies.length / count),
//           movies: results
//         })
//       })
//   }
//   else {
//     Movie
//       .find({title: new RegExp(q + '.*', 'i')})
//       .exec(function(err, movies) {
//         if (err) {
//           console.log(err)
//         }
//         var results = movies.slice(index, index + count)
//
//         res.render('results', {
//           title: 'imooc 结果列表页面',
//           keyword: q,
//           currentPage: (page + 1),
//           query: 'q=' + q,
//           totalPage: Math.ceil(movies.length / count),
//           movies: results
//         })
//       })
//   }
// }
