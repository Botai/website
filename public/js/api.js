
$('#new_movies_local').click(function () {
  $(".new_movies_title").html("");
  $.ajax({
    url: 'https://api.douban.com/v2/movie/in_theaters',
    cache: true,
    type: 'get',
    dataType: 'jsonp',
    crossDomain: true,
    jsonp: 'callback',
    data: {
      city: "大连"
    },
    success: function(newdata) {
      $('#new_movies_local').html(newdata.title);
      $('#coming_soon').html("获取即将上映电影");
      $('.thumbnail').css('height','300px');
      for (var i = 0; i < newdata.subjects.length; i++) {
        var html = '<div class="col-md-2"><div class="thumbnail"><img src="' + newdata.subjects[i].images.medium +'" ><div class="caption"><h3> '+ newdata.subjects[i].title +' </h3><p><a href="' + newdata.subjects[i].alt + ' ">观看预告片 </a></p></div></div></div>';

        $(".new_movies_title").append(html);
      }
      console.log(newdata);
    }
  });

})

$('#coming_soon').click(function () {
  $(".new_movies_title").html("");
  $.ajax({
    url: 'https://api.douban.com/v2/movie/coming_soon',
    cache: true,
    type: 'get',
    dataType: 'jsonp',
    crossDomain: true,
    jsonp: 'callback',
    data: {
      city: "大连"
    },
    success: function(newdata) {
      $('#coming_soon').html(newdata.title);
      $('#new_movies_local').html("获取最近热映电影");
      $('.thumbnail').css('height','300px');
      for (var i = 0; i < newdata.subjects.length; i++) {
        var html = '<div class="col-md-2"><div class="thumbnail"><img src="' + newdata.subjects[i].images.medium +'" ><div class="caption"><h3> '+ newdata.subjects[i].title +' </h3><p><a href="' + newdata.subjects[i].alt + ' ">观看预告片 </a></p></div></div></div>';

        $(".new_movies_title").append(html);
      }
      console.log(newdata);
    }
  });

})
