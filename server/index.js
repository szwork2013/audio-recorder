const express = require('express');
const config = require('./config');
const app = express();
const path = require('path');
const http = require('http');
const server = http.Server(app);


app.use(express.static(path.join(__dirname,'../public')));

app.use('/audio', express.static(path.join(__dirname,'../audio-files')));
app.use('/api', require('./routes'));

require('./sockets')(server);

server.listen(config.port);