class ChatController{
  constructor(){
      this.initializeEventListener();
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
      let self = this;
      self.inputMessage = document.getElementById('inputMessage');
      // chats container
      self.chatAll = document.getElementById('all');
      self.allMessages = document.getElementById('allMessages');
      
      self.chatBattleLogs = document.getElementById('battleLogs');
      self.battleLogsMessages = document.getElementById('battleLogsMessages');
      self.chatBattleLogs.style.display = 'none';
      
      self.chatParty = document.getElementById('party');
      self.partyMessages = document.getElementById('partyMessages');
      self.chatParty.style.display = 'none';
      self.messages = document.getElementById('messages');
      document.querySelectorAll('.chatButton').forEach(button => {
        button.addEventListener('click', function(){
          document.querySelectorAll('.chat').forEach((chat)=>{
            chat.style.display ='none';
          });
          switch (button.id) {
            case 'chatAllButton':
              self.chatAll.style.display = 'block';
              break;
          
            case 'chatBattleLogsButton':
              self.chatBattleLogs.style.display = 'block';
              break;
            
            case 'chatPartyButton':
              self.chatParty.style.display='block';
              break;
              
            default:
              break;
          }
        });
      });
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
   
  addChatPartyElement(el) {
    this.partyMessages.appendChild(el);
    this.partyMessages.lastChild.scrollIntoView();
  }

  addChatAllElement(el){
    this.allMessages.appendChild(el);
    this.allMessages.lastChild.scrollIntoView();
  }

  addChatBattleLogsElement(el){
    this.battleLogsMessages.appendChild(el);
    this.battleLogsMessages.lastChild.scrollIntoView();
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
