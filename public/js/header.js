$(function () {
  var test = window.location.pathname;
  if(test == '/') {
    $('.nav1').addClass('active');
  } else if (test == '/admin/movie/list') {
    $('.nav2').addClass('active');
  }else if (test == '/admin/movie') {
    $('.nav3').addClass('active');
  }else if (test == '/admin/category/new') {
    $('.nav4').addClass('active');
  }else if (test == '/admin/category/list') {
    $('.nav5').addClass('active');
  }else if (test == '/admin/user/list') {
    $('.nav6').addClass('active');
  }else if (test == '/admin/contact') {
    $('.nav7').addClass('active');
  }

})
