class ChatController{
  constructor(){
      this.initializeEventListener();
      this.inputMessage = null;
      this.messages = null;
  }

  initializeEventListener(){
    window.addEventListener('keydown', event => {
      if (event.which === 13) {
        this.sendMessage();
      }
      if (event.which === 32) {
        if (document.activeElement === this.inputMessage) {
          this.inputMessage.value = this.inputMessage.value + ' ';
        }
      }
    });
    window.onload = () =>{
      this.inputMessage = document.getElementById('inputMessage');
      this.messages = document.getElementById('messages');
    }
  }

  //send a custom event with the message. The client controller is listening for this event
  sendMessage() {
    let message = this.inputMessage.value;
    if (message) {
      this.inputMessage.value = '';
      window.dispatchEvent(
        new CustomEvent(
          'submit-chatline',
          {
            detail: message
          }
        )
      )
    }
  }
   
  addMessageElement(el) {
    this.messages.appendChild(el);
    this.messages.lastChild.scrollIntoView();
  }

  createMessageElement(data){
    let usernameSpan = document.createElement('span');
    let usernameText = document.createTextNode(data.username);
    usernameSpan.className = 'username';
    usernameSpan.appendChild(usernameText);
    
    let messageBodySpan = document.createElement('span');
    let messageBodyText = document.createTextNode(data.message);
    messageBodySpan.className = 'messageBody';
    messageBodySpan.appendChild(messageBodyText);
    
    let messageLi = document.createElement('li');
    messageLi.setAttribute('username', data.username);
    messageLi.appendChild(usernameSpan);
    messageLi.appendChild(messageBodySpan);
    return messageLi;
  }
}
