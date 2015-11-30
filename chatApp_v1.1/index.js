var http = require('http');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var nicknames=[];

server.listen(4500,function(){
  console.log("server listening at http://localhost:4500");
});


app.use('/public',express.static(__dirname+'/public'));


app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',function(socket){
  socket.on('new user',function(data,callback){
    if(nicknames.indexOf(data)!=-1){
      callback(false);
    }

    else {
      callback(true);
      socket.nickname = data;
      nicknames.push(socket.nickname);
      updateNicknames();
    //  io.sockets.emit('usernames',nicknames);
    }
  });

  function updateNicknames(){
      io.sockets.emit('usernames',nicknames);
  }


  socket.on('is typing',function(data){
    io.sockets.emit('typing',{msg:data,nick:socket.nickname});
  })

  socket.on('send message',function(data){
    // io.sockets.emit('new message',data);
    io.sockets.emit('new message',{msg:data,nick:socket.nickname});
  });


  socket.on('disconnect',function(data){
    if(!socket.nickname) return;
    nicknames.splice(nicknames.indexOf(socket.nickname),1);
    updateNicknames();
  });
})
