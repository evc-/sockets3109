const port = process.env.PORT || 10000;
const server = require("http").Server();

var io = require("socket.io")(server);
//var allUsers =[];
//var allUsers1 =[];
//var allUsers2 = [];
var allusers = {};
var allstickers = {};

io.on("connection", function(socket){
    console.log("Connection");
    
    socket.on("stick", function(data){
        allstickers[this.myRoom].push(data);
        io.to(this.myRoom).emit("newsticker",
            allstickers[this.myRoom]);
    });

    //console.log(allUsers);
    
    socket.on("joinroom", function(data){
        console.log(data);
        socket.join(data);
        
        socket.myRoom = data;
        socket.emit("yourid", socket.id);
        
        if(!allusers[data]){
            allusers[data] = [];
            allstickers[data] = [];
        }

        allusers[data].push(socket.id);
        io.to(data).emit("userjoined", allusers[data]);
        io.to(data).emit("newsticker", allstickers[data]);
        
//        if(data == "room1"){
//            allUsers1.push(socket.id)
//            io.to(data).emit("userjoined", allUsers1)
//        } else if (data == "room2"){
//            allUsers2.push(socket.id)
//            io.to(data).emit("userjoined", allUsers2)
//        }
    });
    
//    io.emit("userjoined", allUsers);
    
//    socket.emit("yourid", socket.id);
    
    socket.on("mymove", function(data){
        socket.to(this.myRoom).emit("newmove", data);
    });
    
    socket.on("disconnect", function(){
        
        var index = allusers[this.myRoom].indexOf(socket.id);
        allusers[this.myRoom].splice(index, 1);
        io.to(this.myRoom).emit("userjoined", allusers[this.myRoom]);
        
        if (this.myRoom){
            var index=
                allusers[this.myRoom].indexOf(socket.id);
                allusers[this.myRoom].splice(index, 1);
                io.to(this.myRoom).emit("userjoined", allusers[this.myRoom]);
        }
        /*var index = allUsers.indexOf(socket.id);
        allUsers.splice(index, 1);
        io.emit("userjoined", allUsers);*/
    })
});

server.listen(port, (err)=>{
    if(err){
        console.log(err);
        return false;
    }
    console.log("Port is running");
})