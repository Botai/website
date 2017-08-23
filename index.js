var http = require("http");
var url = require("url");
var querystring = require("querystring");
var fs = require("fs");

console.log('监听8889');

// http.createServer(function(request, response) {
//   response.writeHead(200, {"Content-Type": "application/json"});
//   response.write("Hello World");
//   console.log("获取成功！");
//
// }).listen(8888);

http.createServer(function(req, res) {
  // 设置接收数据编码格式为 UTF-8
  req.setEncoding('utf-8');
  var postData = ""; //POST & GET ： name=zzl&email=zzl@sina.com
  // 数据块接收中
  req.addListener("data", function(postDataChunk) {
    postData += postDataChunk;
  });

  // res.writeHead(200, {"Content-Type": "application/json"});
  // res.write(postData);

  //数据接收完毕，执行回调函数

  req.addListener("end", function () {
      console.log('数据接收完毕');
      var params = querystring.parse(postData);//GET & POST  ////解释表单数据部分{name="zzl",email="zzl@sina.com"}
      // console.log(params);
      console.log(postData);
      var data = eval(postData);

      fs.writeFileSync('./app/data/test.json', postData);
      console.log("写文件成功");
      // console.log(typeof(data));

      // res.writeHead(500, {
      //     "Content-Type": "text/plain;charset=utf-8"
      // });

      // for (var i = 0; i < data.length; i++) {
      //   console.log("user_id: " + data[i].user_id);
      //   console.log("name: " + data[i].name);
      //   console.log("age: " + data[i].age);
      //   console.log("-------------");
      // }
      res.end("数据提交完毕");
  });

}).listen(8889, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8889/');
