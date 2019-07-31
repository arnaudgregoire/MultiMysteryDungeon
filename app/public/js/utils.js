
function getCookie (name) {
  var key = name + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookies = decodedCookie.split(";");
  for(var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    // while (cookie.charAt(0) == " ") {
    //   cookie = cookie.substring(1);
    // }
    if (cookie.indexOf(key) == 0) {
      return cookie.substring(key.length, cookie.length);
    }
  }
  return "";
}

function assign(source, target) {
  for (var key in target) {
    if (source.hasOwnProperty(key)) {
      source[key] = target[key];
    }
  }
}

var Utils = {
  getCookie: getCookie,
  assign: assign
};
