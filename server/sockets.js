const socketio = require('socket.io');
const AudioRecording = require('./audioRecording');
const ss = require('socket.io-stream');
module.exports = server => {
  const io = socketio(server);
  io.on('connection', socket => {
    let recording = new AudioRecording();

    ss(socket).on('audio-stream', (stream, meta) => {
      if(recording.started) { return; }
      console.log('stream open');
      recording.start(stream);
      recording.on('end', () => {
        io.to(socket.id).emit('audio-finised', recording.fileName);
        recording = new AudioRecording();
      });

    });

    socket.on('audio-set-id', id => {
      recording.setId(id);
    })

    socket.on('audio-meta', data => {
      recording.meta(data);
    })

    socket.on('disconnect', () => {
      recording.end();
    })

  });
}