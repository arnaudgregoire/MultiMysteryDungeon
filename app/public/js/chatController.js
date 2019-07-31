function ChatController() {
  this.initializeEventListener();
}

ChatController.prototype.initializeEventListener = function () {
  window.addEventListener("keydown", function (e) {
    if (e.which === 13) {
      this.sendMessage();
    }
    else if (e.which === 32 && document.activeElement === this.inputMessage) {
      this.inputMessage.value = this.inputMessage.value + " ";
    }
  }.bind(this));

  window.addEventListener("onClientLoad", this.initializeContent.bind(this));
};

ChatController.prototype.initializeContent = function () {
  this.inputMessage = document.getElementById("inputMessage");
  this.tabName = document.getElementById("tabName");

  this.chatAll = document.getElementById("all");
  this.allMessages = document.getElementById("allMessages");

  this.chatBattleLogs = document.getElementById("battleLogs");
  this.battleLogsMessages = document.getElementById("battleLogsMessages");
  this.chatBattleLogs.style.display = "none";

  this.chatParty = document.getElementById("party");
  this.partyMessages = document.getElementById("partyMessages");
  this.chatParty.style.display = "none";

  var buttons = document.querySelectorAll(".chatButton");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (e) {
      this.toggleChat(e.target.id);
    }.bind(this));
  }
};

ChatController.prototype.toggleChat = function (chatId) {
  var elements = document.querySelectorAll(".chat");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
  switch (chatId) {
    case "chatAllButton":
      this.chatAll.style.display = "block";
      this.tabName = "Channel all";
      break;
    case "chatBattleLogsButton":
      this.chatBattleLogs.style.display = "block";
      this.tabName = "Channel Battle Logs";
      break;
    case "chatPartyButton":
      this.chatParty.style.display="block";
      this.tabName = "Channel Party (local)";
      break;
  }
};

ChatController.prototype.sendMessage = function () {
  var message = this.inputMessage.value;
  if (message.length > 0) {
    window.dispatchEvent(new CustomEvent("submit-chatline", { detail: message });)
    this.inputMessage.value = "";
  }
};

ChatController.prototype.addChatPartyElement = function (element) {
  this.partyMessages.appendChild(element);
  this.partyMessages.lastChild.scrollIntoView();
};

ChatController.prototype.addChatAllElement = function (element) {
  this.allMessages.appendChild(element);
  this.allMessages.lastChild.scrollIntoView();
};

ChatController.prototype.addChatBattleLogsElement = function (element) {
  this.battleLogsMessages.appendChild(element);
  this.battleLogsMessages.lastChild.scrollIntoView();
};

ChatController.prototype.createMessageElement = function (data) {
  var username = document.createElement("span");
  username.className = "username";
  username.appendChild(document.createTextNode(data.username));

  var messageBody = document.createElement("span");
  messageBody.className = "messageBody";
  messageBody.appendChild(document.createTextNode(data.message));

  var container = document.createElement("li");
  container.setAttribute("username", data.username);
  container.appendChild(username);
  container.appendChild(messageBody);
  return container
};
