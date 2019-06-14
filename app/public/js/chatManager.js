window.addEventListener('keydown', event => {
  if (event.which === 13) {
    sendMessage();
  }
  if (event.which === 32) {
    if (document.activeElement === inputMessage) {
      inputMessage.value = inputMessage.value + ' ';
    }
  }
});
 
function sendMessage() {
  let inputMessage = document.getElementById('inputMessage');
  var message = inputMessage.value;
  if (message) {
    inputMessage.value = '';
    $.ajax({
      type: 'POST',
      url: '/submit-chatline',
      data: {
        message,
        refreshToken: getCookie('refreshJwt')
      },
      success: function(data) {},
      error: function(xhr) {
        console.log(xhr);
      }
    })
  }
}
 
function addMessageElement(el) {
  let messages = document.getElementById('messages');
  messages.appendChild(el);
  messages.lastChild.scrollIntoView();
}