const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const { Socket } = require('dgram');
const bodyParser = require('body-parser');
const path = require('path')
const io = require('socket.io')(http);
let elements = []
let session = false;
let nombre = "";
//we need configure the app for that we can use req.body of the views in routes
//i install body parser "npm i body-parser" and use with urlencoder 
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(bodyParser.json());

//routes
app.get('/room', (req, res) =>{
    if(session){
    res.sendFile(__dirname + '/src/views/index.html');
    }
    else{
        res.redirect('/');
    }
});

app.get('/salir', (req, res) =>{
    session = false;
    res.redirect('/');
})


app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/src/views/login.html', {Nombre:nombre});
});

app.post('/check',  (req, res) =>{
    const {nom, contra} = req.body;
    nombre = nom;
    console.log(req.body);
    if(nombre == "Oliver"){
        session = true;
    }
    res.redirect('/room');
})



//run socket 
io.on('connection', (socket, s) =>{
    console.log('new user connected');

    socket.on('start call', (name) =>{
        elements.push(name);
        io.emit('start call', elements);
    });

    socket.on('chat message', (msg, n) =>{
        //console.log('message: ' + msg);
        io.emit('chat message', msg, n);
    });

    socket.on('end call', (name) =>{
        for(var i = 0; i < elements.length; i++){
            if(elements[i] == name){
                elements.splice(i, 1);
                break;
            }
        }
        console.log(name + "Saldra");
        io.emit('end call', elements);
    })

    //when user desconnected
    socket.on('disconnect', () =>{
        console.log(' user out');
    });
});













//run server
http.listen(3000, () =>{
    console.log("puerto funcionando!");
});




