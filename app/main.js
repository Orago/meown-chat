/* Author: Orago <Orago#0051>*/
// Based on Socket.io
var botname = '⚙️ !v! ittz' //The username of the bot
var cmdlist = prefix+'join, '+prefix+'help, '+prefix+'refresh, '+prefix+'reload, '+prefix+'info, '+prefix+'time '+prefix+'fun, '//simple list of the commands that are easier to reach
var ver = '1.04'//The version of the command used
var prefix = '$' //The symbol used to call a command
var pname = "Mittz Chat";
var staff_only = "This option is for staff only."
var database = "d";
var time_value;
var time;
//window.onload = async function() {}
/*fetch("/data")
  .then(response => response.json()) // parse the JSON from the server
  .then(data => {
database = data;
  });


function data(){
  fetch("/data")
  .then(response => response.json()) // parse the JSON from the server
  .then(data => {
database = data;
  });
}*/
function new_coin(){
  fetch("/add_coin")
  .then(response => response.json()) // parse the JSON from the server
  .then(data => {
database = data;
  });
}

  function new_time(){
time_value = new Date
time = time_value.getTime()
}


var registered;
function passWord() {
var testV = 1;
var pass1 = prompt('Please Enter Your Password',' ');//Password Request Text
while (testV < 3) {
if (!pass1)
history.go(-1);
if (pass1.toLowerCase() == "BetaCatto") {
alert('You Got it Right!');//Password Accepted Text
window.open('/');
break;
}
testV+=1;
var pass1 =
prompt('Access Denied - Password Incorrect, Please Try Again.','Password'); //Password Denied Text
}
if (pass1.toLowerCase()!="password" & testV ==3)
history.go(-1);
return " ";
}

$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#008dff', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7',
    '#CC9014', '#FF6C00', '#7900ff', '#14CC78',
    '#001bff', '#00b2d8', '#7900ff', '#00d877',
    '#4d7298', '#795da3', '#f47577', '#db324d',
    '#EE4035', '#F3A530', '#56B949', '#30499B',
    '#F3A530', '#56B949', '#844D9E', '#4e1c81'
  ];
var time = new Date();
          var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  
  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // login page
  var $chatPage = $('.chat.page'); // Chat room page
  var $roomPage = $('.room.page'); // Room list page
  var $roomList = $('.room-list'); // Room list <ul>
  var $btnTips = $('.btn-tips'); // Tool buttons

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();
  var $roomDiv;
  var roomNameRule = /^(?!\s*$)[a-zA-Z0-9_\u4e00-\u9fa5 \f\n\r\t\v]{1,14}$/;
  
  
  var socket = io();
  socket.emit('connector');
socket.on('handshake', function (data) {
database=data;
  });
  //var file = fs();
  //var db = database();
  function addParticipantsMessage (data) {
    var message;
    if (!data.userJoinOrLeftRoom) {
      if (data.numUsers === 1) {
        message = 'You are alone now!';
      } else {
        message = 'There are ' + data.numUsers + ' users in ' + pname;
      }
    }
    log(message);
  }
  
  //setTimeout(function(){ alert(database.user["orago"]); }, 500);

  // Sets the client's username
  function setUsername () {
    // If user name is input, get and then emit 'add user' event.
    // trim(): remove the whitespace from the beginning and end of a string.
    username = cleanInput($usernameInput.val().trim());
    if (database.profiles.includes(username.toLowerCase())) {
    var pass_input = prompt("Please input the password for the account @"+username, "");
  if (pass_input == null || pass_input == "") {
    {location.reload();return}
  } else {
    /*text given*/   /*alert(pass_input);*/if (database.user[username.toLowerCase()]==pass_input.toLowerCase()){alert("Success!")}else{alert("Wrong password!");return location.reload();}
  }
    }
    
    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $roomPage.fadeIn();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
      
    }
  }

  // Sends a chat message.
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (connected) {
      $inputMessage.val('');
      if (message.charAt(0) !== prefix) {
        addChatMessage({
          username: username,
          message: message
        });
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
        // If input a command with '/'.
      } else {
        inputCommand(message);
      }
    }
  }

  // Sends a command.
  function inputCommand (message) {
    var words = message.split(' ');
    var cmd = words[0]
      .substring(1, words[0].length)
      .toLowerCase();

    switch (cmd) {
        
      //Tool Commands
      case 'join':// Command /join [room name] = join room.
        words.shift();
        var room = words.join(' ');
        if (roomNameRule.test(room)) {
          socket.emit('join room', room);
          //noinspection JSUnresolvedVariable
          $roomList[0].scrollTop = $roomList[0].scrollHeight;
        } else {
          log('Length of room name is limited to 1 to 14 characters, ' +
              'and can only be composed by the Chinese, ' +
            'English alphabet, digital and bottom line', {})
        }
        break;
        
      case 'help': // Command /help lists all commands
        message = 'Help list: '+prefix+'help1, '+prefix+'help2, '+prefix+'help3 ';
        log(message);
        break;
        
      case 'help1': // Command /help lists all commands
        log('--------------------');
        log('-- Help List --');
        log('-_- Page - 1 Useful Commands -_-');
        log(prefix+'help - Shows a list of helping commands'); log(prefix+'fun - shows a list of fun commands'); log(prefix+'ree - Basically just says ree with audio (turn ur volume up)');
        log(prefix+'commands - Shows a list of useable commands'); log(prefix+'updates - shows a list of new updates'); log(prefix+'refresh - This command refreshes the room list if new ones arent loading');
        log('-- use /help2 for more info --');
        log('--------------------');
        break;
        
      case 'help2': // Command /help lists all commands
        log('--------------------');
        log('-- Help List --');
        log('-_- Page - 2 Useful Commands -_-');
        log(prefix+'info - Shows server version and creator info'); log(prefix+'time - Shows the current time'); log('/reload - This command will reload the server page');
        log(''); log(''); log('');
        log('-- use '+prefix+'help3 for more info --');
        log('--------------------');
        break;
        
      case 'help3': // Command /help lists all commands
        log('--------------------');
        log('-- Help List --');
        log('-_- Page - 3 Fun Commands -_-');
        log(prefix+'pet - Shows a list of pets that can be used'); log(prefix+'cf - Flips a coin which will either end up with a heads or tails');
        log(prefix+'bored - Will make a bot say this user is bored'); log(''); log('');
        log('-- use '+prefix+'help for more info --');
        log('--------------------');
        break;
        
      case 'updates': // Command /help lists all commands
        log('--------------------');
        log('-- Updates List --');
        log('-_- Useful Commands -_-');
        log('- Fixed Coin Flipping, '+prefix+'cf'); log('- Fixed the ob command'); log('- Fixed pets not functioning');
        log('- Added a '+prefix+'ree command for fun'); log('- Added a month and day for '+prefix+'time'); log('- Added a '+prefix+'update function');
        log('-- use '+prefix+'help2 for more info --');
        log('--------------------');
        break;
        
      case 'commands': // Command /help lists all commands
        message = 'Commands: '+cmdlist+prefix+'help';
        log(message);
        break;
        
      case 'fun': // Command /fun a list of fun commands
        message = 'Fun Commands: '+prefix+'slap, '+prefix+'bored, '+prefix+'cf, '+prefix+'pets, '+prefix+'ree';
        log(message);
        break;
        
      case 'pets': // Command /fun a list of fun commands
        message = 'Pets: '+prefix+'cat, '+prefix+'dog';
        log(message);
        break;
        case 'username': // Command /fun a list of fun commands
        message = username;
        log(message);
        break;
      case 'refresh':// Command /refresh = reload room list.
        socket.emit('room list');
        break;
        
      case 'beta':// Command /refresh = reload room list.
        passWord()
        break;
        
      case 'my':// Command /refresh = reload room list.
        words.shift();
        var jchat = words.join(' ');
        if (jchat == "username"){
          alert(username);
        }
        break;
        case 'info':// Command /refresh = reload room list.
        alert(database)
        break;
      case 'set-username':// Command /refresh = reload room list.
        words.shift();
        var jchat = words.join(' ');
          
          alert(username);
        break; 
      case 'info':// Command /info = Server info
        message = 'This server is running V'+ver;
        log(message);
        break;
        
      case 'time': // Command /time shows the current time
        message = 'The time is '+month[time.getMonth()]+', '+weekday[time.getDay()]+' '+time.getHours()+':'+time.getMinutes();
        log(message);
        break;
        
      case 'reload': // Command /reload will reload the website page
        window.location.reload(true);
        message = 'Reloading will now commence...'
        log(message);
        break;    
        
  //fun commands
      case 'slap':// Slaps the text given
      words.shift();
      var jchat = words.join(' ');
      if (roomNameRule.test(jchat)) {
      addChatMessage({
          username: username,
          message: 'has slapped ' + jchat
        });
        socket.emit('new message', message);}
        else{
          log('Please select a text that you would like to slap, ' +
              'Example /slap cat', {})}
        break;
        
      case 'bored': //im bored
      addChatMessage({
          username: botname,
          message: 'hi'
          });
          socket.emit('new message',botname);
        break;
        
      case 'inverted':// Slaps the text given
      words.shift();
      var jchat = words.join(' ');
        var cat='kitty'
      if (cat='kitty') {
      addChatMessage({
          username: jchat,
          message: username
        });
        socket.emit('i-chat',jchat);}
        else{
          log('Please use the command correctly, also must have less than 10 letters, ' +
              'Example '+prefix+'inverted joe', {})}
        break;

        
        case 'register':
      words.shift();
        //log(database.profiles.includes(username.toLowerCase()))
        if (database.profiles.includes(username.toLowerCase())){return log("You are already logged in!")}
      var password = words.join(' ');
      if (password){
        var txt;
      var r = confirm("Are you sure you want the password \""+password+"\"");
      if (r == true) {
        log("Your password is now \""+password+"\", @"+username+" Please write this somewhere so it doesn't get forgotten, currently we do not have the service to reset passwords!");
        socket.emit('create account', password);
        data();
        //setTimeout(function(){ window.location.reload(); }, 15000);
      } else {
        log("You have canceled")
      }
    }
        else{
          log('Please use the command correctly, also must have less than 10 letters, ' +
              'Example '+prefix+'register Password12345')}
        break;
        
        case 'daily':
      words.shift();
        time_value = new Date
        var get_data = parseInt(database.last_daily[username.toLowerCase()])+86400000
        
        var coin_amount = 50;
        if (!database.profiles.includes(username.toLowerCase())){return log("You have not registered yet!")}
        if (time >= get_data){return log("You need to wait a a whole day to do this again!")}
        log("HRM"+time);
        log(String(get_data));
        log(`You have claimed your daily ${coin_amount} coins!`);
        socket.emit('claim daily', time);
        data();
        break;
        
        case 'coins':
      words.shift();
        data();
        if (!database.profiles.includes(username.toLowerCase())){return log("Please create a user with '"+prefix+"register' !")}
        log("You have "+database.coins[username.toLowerCase()]+" coins.");
        
        break;
        
        case 'give':
      words.shift();
        if (!database.moderators.includes(username.toLowerCase())||!database.admins.includes(username.toLowerCase())){return log(staff_only)}
        if (!database.profiles.includes(username.toLowerCase())){return log("Please create a user with '"+prefix+"register' !")}
        var amount = words.join(' ');
      if (amount){
        socket.emit('add coin',amount);
        data();
        log("You have "+database.coins[username.toLowerCase()]+" coins.");
    }
        else{
          log('Please use the command correctly, also must have less than 10 letters, ' +
              'Example '+prefix+'give 12345')}

        break;
        
        
        

      case 'say':// Slaps the text given
      words.shift();
      var jchat = words.join(' ');
        var cat='kitty'
      if (cat='kitty') {
      addChatMessage({
          username: botname,
          message: jchat
        });
        socket.emit('sbot',jchat);}
        else{
          log('Please use the command correctly, also must have less than 10 letters, ' +
              'Example '+prefix+'say cat', {})}
        break;
        
      case 'ree':// Slaps the text given
          var audio = new Audio('https://cdn.glitch.com/b792ab51-deee-4647-a7bb-4717144ab5da%2Freeeeee-sound-effect-2oGr22XU.mp3?v=1574807326622');
          audio.play();
          addChatMessage({
          username: botname,
          message: 'REEEEEEEEEEEEEEEEEEEEEeeeeeeeeeeeeeeee'
        });
        socket.emit('new message','REE');

        break;
      
        
        case 'cf': //coinflip
          var prob1 = Math.floor(Math.random() * 2) +1;
          var prob2 = Math.floor(Math.random() * 2) +1;
          if( prob1 === prob2){
          socket.emit('bot message',`${username}, flipped a coin and got heads!`);
          addChatMessage({username: botname,message:username+' flipped a coin and got Heads'});
          }else{
          addChatMessage({username: botname,message:username+' flipped a coin and got Heads'});
          socket.emit('new message',`${username}, flipped a coin and got tails!`);
          }
        break;
        
      default:
        message = 'You have entered an invalid command';
        log(message);
        break;
    }
  }

  // Log a message
  function log (message, options) {
    options = options || {};
    var $logDiv;

    if (typeof options.userConnEvent !== 'undefined') {
      var userName = options.username;
      var colorOfUserName = getUsernameColor(userName);
      var $usernameDiv = $('<span class="username">')
        .text(userName)
        .css('color', colorOfUserName);
      // var $logBodyDiv = $('<span>').text(message);
      $logDiv = $('<li>')
        .addClass('log')
        .append($usernameDiv, message);
      addMessageElement($logDiv, options);
    } else {
      $logDiv = $('<li>').addClass('log').text(message);
      addMessageElement($logDiv, options);
    }
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var userName = data.username;
    var colorOfUserName = getUsernameColor(userName);
    if (data.typing !== true) {
      userName += ': ';
    }
    if (data.message !== ''){
      var $usernameDiv = $('<span class="username"/>')
        .text(userName)
        .css('color', colorOfUserName);
      var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.message);

      var typingClass = data.typing ? 'typing' : '';
      var $messageDiv = $('<li class="message"/>')
        .data('username', userName)
        .addClass(typingClass)
        .append($usernameDiv, $messageBodyDiv);

      addMessageElement($messageDiv, options);
    }
  }

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing...';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    // When sending message, make screen to last message (here is bottom).
    //noinspection JSUnresolvedVariable
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function () {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username.
  function getUsernameColor (username) {
    var eachCharCode = 0;
    var randIndex;
    for (var ii = 0; ii < username.length; ii++) {
      eachCharCode += username.charCodeAt(ii);
    }
    randIndex = Math.abs(eachCharCode % COLORS.length);
    return COLORS[randIndex];
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    //noinspection JSUnresolvedVariable
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = '— Welcome to ' + pname+ ' —';
    var prefhelp = 'The bot prefix is currently ' + prefix;
    log(prefhelp, {
      prepend: true
    });
    log(message, {
      prepend: true
    });
    
    addParticipantsMessage(data);
  });

  socket.on('get account', function (data) {
    log("The stuff");log(JSON.stringify(data));
  });
  
  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);

  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.logAction + data.logLocation + data.roomName, {
      userConnEvent: true,
      username: data.username
    });
    addParticipantsMessage(data);
    socket.emit('room list');
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.logAction + data.logLocation + data.roomName, {
      userConnEvent: true,
      username: data.username
    });
    addParticipantsMessage(data);
    removeChatTyping(data);
    // Reload room list.
    socket.emit('room list');
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  socket.on('disconnect', function () {
    log('You have disconnected...');
    // Reload room list.
    socket.emit('room list');
  });

  socket.on('reconnect', function () {
    log('You have reconnected!');
    if (username) {
      socket.emit('add user', username);
      // Reload room list.
      socket.emit('room list');
    }
  });

  socket.on('reconnect_error', function () {
    log('Reconnect failed...');
  });

  // Show current room list.
  socket.on('show room list', function (room, rooms) {
    $roomList.empty();
    var roomClassName = room.trim().toLowerCase().replace(/\s/g,'');

    $.each(rooms, function (roomName, numUserInRoom) {
      // Set class name of room's <div> to be clear.
      var className = roomName.trim().toLowerCase().replace(/\s/g,'');
      $roomDiv = $('<div class="room"></div>')
        .html('<b>' + roomName + '</b>'
          + '<span class="user-number-in-room">'
          + '(' + numUserInRoom + ' users' + ')' + '</span>')
        .addClass(className)
        .click(function () {
          socket.emit('join room', roomName);
          $inputMessage.focus();
        });
      $roomList.append($roomDiv);
    });

    $('.' + roomClassName).addClass('joined-room');
  });

  socket.on('join left result', function (data) {
    // log results.
    log(data.username + data.logAction
      + data.logLocation + data.roomName, {});
  });

  // Every 30 secs. reload current room list.
  setInterval(function () {
    socket.emit('room list');
  }, 30000);


  // jQuery UI Style
  $roomList.sortable();
  $btnTips.tooltip();
  $btnTips.on( "click", function() {
    $('#effect-tips').toggle('blind');
  });
});