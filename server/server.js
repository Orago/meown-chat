// Setup basic express server
var express = require('express');
const fs = require("fs");

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3232;
var botname = '⚙️ !v! ittz'
let database = JSON.parse(fs.readFileSync(__dirname+"/database.json"));
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/../app'));

// Chat room

// Total number of users
var numUsers = 0;
// Current room list.
var curRoomList = {};

// Action: Create, Join, Left.
var logCreate = 'Created ';
var logJoin = 'joined ';
var logLeft = 'Left ';

// Location: Lab (main website, can be joined or left),
//           Room (can be created, joined, Left)
var logLab = 'Chat lab';
var logRoom = ' room ';

io.on('connection', function (socket) {
  var addedUser = false;
  var curRoomName = 'Lobby';
  
socket.on('create account', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: socket.username+" has just registered!"//data
    });
  database.profiles.push(socket.username)
  database.user[socket.username]=data;
  fs.writeFileSync(__dirname+"database.json", JSON.stringify(database, null, 2));
  });
  
  socket.on('get account', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('get account', {
      everything: database.user[socket.username]
    });
  });
  
    socket.on('get user', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('get account', {
      username: socket.username,
      password: data//data
    });
  });
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: socket.username,
      message: data
    });
  });
  //commands
    socket.on('i-chat', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: data,
      message: socket.username
    });
  });
  
      socket.on('sbot', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: data
    });
  });
  //games
    //coinflip
    socket.on('cf-heads', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: socket.username+' flipped a coin and got Heads'
    });
  });
   socket.on('cf-tails', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: socket.username+' flipped a coin and got Tails'
    });
  });  
  
  //pet 
  socket.on('cat message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: '🐈',
      message: 'Meow!'
    });
  });

  socket.on('dog message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: '🐕',
      message: 'Woof!'
    });
  });
  
  
  
  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;

    // Default to join 'Lobby'.
    socket.join(curRoomName);

    // If there is no the same curRoomName in room list, add it to room list.
    // And set user number in it = 1, else user number + 1.
    if (!isRoomExist(curRoomName, curRoomList)) {
      curRoomList[curRoomName] = 1;
    } else {
      ++curRoomList[curRoomName];
    }

    // First join chat room, show current room list.
    socket.emit('show room list', curRoomName, curRoomList);

    socket.emit('login', {
      numUsers: numUsers
    });

    // echo to room (default as 'Lobby') that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      logAction: logJoin,
      logLocation: logLab,
      roomName: '',
      userJoinOrLeftRoom: false
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.to(curRoomName).emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects, perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;
      --curRoomList[curRoomName];

      // If there is no user in room, delete this room,
      // Except this room is 'Lobby'.
      if (curRoomList[curRoomName] === 0 && curRoomName !== 'Lobby') {
        delete curRoomList[curRoomName];
      }

      if (numUsers === 0) {
        curRoomList = {};
      }
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers,
        logAction: logLeft,
        logLocation: logLab,
        roomName: ''
      });
    }
  });

  // Show room list to user.
  socket.on('room list', function () {
    socket.emit('show room list', curRoomName, curRoomList);
  });

  socket.on('join room', function (room) {
    socket.emit('stop typing');

    if (room !== curRoomName) {
      // Before join room, first need to leave current room. -------------------
      socket.leave(curRoomName);
      socket.broadcast.to(curRoomName).emit('user left', {
        username: socket.username,
        numUsers: numUsers,
        logAction: logLeft,
        logLocation: logRoom,
        roomName: '「' + curRoomName + '」',
        userJoinOrLeftRoom: true
      });
      --curRoomList[curRoomName];

      // If there is no user in room, delete this room,
      // Except this room is 'Lobby'.
      if (curRoomList[curRoomName] === 0 && curRoomName !== 'Lobby') {
        delete curRoomList[curRoomName];
      }

      // Then join a new room. -------------------------------------------------
      socket.join(room);

      // If there is no the same room in room list, add it to room list.
      if (!isRoomExist(room, curRoomList)) {
        curRoomList[room] = 1;
        socket.emit('join left result', {
          username: 'you ',
          logAction: logCreate,
          logLocation: logRoom,
          roomName: '「' + room + '」'
        });
      } else {
        ++curRoomList[room];
        socket.emit('join left result', {
          username: 'you ',
          logAction: logJoin,
          logLocation: logRoom,
          roomName: '「' + room + '」'
        });
      }

      // Every time someone join a room, reload current room list.
      socket.emit('show room list', room, curRoomList);
      curRoomName = room;
      socket.broadcast.to(room).emit('user joined', {
        username: socket.username,
        numUsers: numUsers,
        logAction: logJoin,
        logLocation: logRoom,
        roomName: '「' + room + '」',
        userJoinOrLeftRoom: true
      })
    }
  });
});

// Check if roomName is in roomList Object.
function isRoomExist (roomName, roomList) {
  return roomList[roomName] >= 0;
}