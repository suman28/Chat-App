var http = require('http');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// var nicknames=[];
var users = {};

server.listen(4500,function(){
  console.log("server listening at http://localhost:4500");
});


app.use('/public',express.static(__dirname+'/public'));


app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',function(socket){
  socket.on('new user',function(data,callback){
    // if(nicknames.indexOf(data)!=-1){
    if(data in users){
      callback(false);
    }

    else {
      callback(true);
      socket.nickname = data;
      users[socket.nickname] = socket;
      // nicknames.push(socket.nickname);
      updateNicknames();
    //  io.sockets.emit('usernames',nicknames);
    }
  });

  function updateNicknames(){
      io.sockets.emit('usernames',Object.keys(users));
  }


  socket.on('is typing',function(data){
    io.sockets.emit('typing',{msg:data,nick:socket.nickname});
  })

  socket.on('send message',function(data,callback){
    // io.sockets.emit('new message',data);
    var msg = data.trim();
    if(msg.substr(0,3)==='/w '){
        msg = msg.substr(3);
        var ind = msg.indexOf(' ');
        if(ind!==-1){
            var name = msg.substring(0,ind);
            var msg = msg.substring(ind+1);
            if(name in users){
              users[name].emit('whisper',{msg:msg,nick:socket.nickname});
              console.log('whisper');
            }
            else{
              callback("Error! Enter a valid user");
            }

        }
        else{
          callback("Error! Please enter a message to your whisper!");
        }

    }
    else{
      io.sockets.emit('new message',{msg:msg,nick:socket.nickname});
    }

  });


  socket.on('disconnect',function(data){
    if(!socket.nickname) return;
    delete users[socket.nickname];
    // nicknames.splice(nicknames.indexOf(socket.nickname),1);
    updateNicknames();
  });
})
