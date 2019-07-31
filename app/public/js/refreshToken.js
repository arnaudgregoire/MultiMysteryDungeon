function getCookie(name) {
  var key = name + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookies = decodedCookie.split(";");
  for(var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(key) == 0) {
      return cookie.substring(key.length, cookie.length);
    }
  }
  return "";
}

setInterval(function() {
  $.ajax({
    type: "POST",
    url: "/token",
    data: {
      refreshToken: getCookie("refreshJwt")
    },
    success: function(data) {
    },
    error: function(xhr) {
      window.alert(JSON.stringify(xhr));
      window.location.replace("/index.html");
    }
  });
}, 10000);
