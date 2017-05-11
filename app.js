var express = require('express');
var path = require('path');
var session = require('express-session');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var logger = morgan('dev');

var app = express();
var dbUrl = 'mongodb://localhost/webSite';
var port = process.env.PORT || 3000;

mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
  secret: 'website',
  store: new MongoStore({
    url: dbUrl,
    collection: 'sessions',
  }),

}));
//app.configer  配置
//本地配置 if else
if('development' === app.get('env') ) {
  //打印报错信息
  app.set('showStackError', true);
  app.use(logger);
  //页面代码格式化
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.locals.moment = require('moment');

require('./config/routes')(app);

app.listen(port);
console.log('server is start on port '+ port);
