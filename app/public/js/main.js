window.clientController = new ClientController();

setInterval(function() {
  $.ajax({
    type: "POST",
    url: "/token",
    data: {
      refreshToken: Utils.getCookie("refreshJwt")
    },
    success: function(data) {
    },
    error: function(xhr) {
      window.alert(JSON.stringify(xhr));
      window.location.replace("/index.html");
    }
  });
}, 10000);
