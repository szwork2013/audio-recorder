const express = require('express');
const config = require('./config');
const app = express();
const http = require('http');
const server = http.Server(app);


app.use(express.static('public'));

app.use('/audio', express.static('audio-files'));


require('./sockets')(server);

server.listen(config.port);