const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
app.use(express.static('public'));

players={}

io.on('connect', (socket) => {
  socket.id=Math.random()
  players[socket.id]={}
  players[socket.id].socket=socket.id
  players[socket.id].x=0
  players[socket.id].z=0
  players[socket.id].walkSpeed=0.1
  socket.on('angle',(e)=>{
    players[socket.id].xa=e.x
    players[socket.id].ya=e.y
  })
  socket.on('move',(e)=>{
    //ZINGULAR:
    if(e.key==65){//Left.
      players[socket.id].k1=true
    }else{
      players[socket.id].k1=false
    }
    if(e.key==87){//Up.
      players[socket.id].k2=true
    }else{
      players[socket.id].k2=false
    }
    if(e.key==68){//Right.
      players[socket.id].k3=true
    }else{
      players[socket.id].k3=false
    }
    if(e.key==83){//Down.
      players[socket.id].k4=true
    }else{
      players[socket.id].k4=false
    }

    if(e.key==81){//Q (Stop).
      players[socket.id].walkSpeed=0
    }else{
      players[socket.id].walkSpeed=0.1
    }
  })
  setInterval(()=>{
    if(players[socket.id].k1==true){
      players[socket.id].x+=players[socket.id].walkSpeed*Math.cos(players[socket.id].xa)
      players[socket.id].z-=players[socket.id].walkSpeed*Math.sin(players[socket.id].xa)
    }
    if(players[socket.id].k2==true){
      players[socket.id].x+=players[socket.id].walkSpeed*Math.sin(players[socket.id].xa)
      players[socket.id].z+=players[socket.id].walkSpeed*Math.cos(players[socket.id].xa)
    }
    if(players[socket.id].k3==true){
      players[socket.id].x-=players[socket.id].walkSpeed*Math.cos(players[socket.id].xa)
      players[socket.id].z+=players[socket.id].walkSpeed*Math.sin(players[socket.id].xa)
    }
    if(players[socket.id].k4==true){
      players[socket.id].x-=players[socket.id].walkSpeed*Math.sin(players[socket.id].xa)
      players[socket.id].z-=players[socket.id].walkSpeed*Math.cos(players[socket.id].xa)
    }
    socket.emit('pack',{x:players[socket.id].x,z:players[socket.id].z})
    socket.emit('all',{all:players})
  },1000/60)
});

server.listen(8000, () => {
  console.log(`Servidor escuchando en el puerto 8000.`);
});