const socket = require('./socketManager');
const ss = require('socket.io-stream');
const events = require('events');

function convertFloat32ToInt16(buffer) {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l])*0x7FFF;
  }
  return buf.buffer;
}


function recorderProcess(e) {
  const left = convertFloat32ToInt16(e.inputBuffer.getChannelData(0));
  // send to socketio 
  // console.log('sreassfdsd', this.ssStream)
  this[socketStreamSymbol].write(new ss.Buffer(left));
}

navigator.getUserMedia_ = (   navigator.getUserMedia
                           || navigator.webkitGetUserMedia 
                           || navigator.mozGetUserMedia 
                           || navigator.msGetUserMedia);

const streamSymbol = Symbol('stream');
const socketStreamSymbol = Symbol('socketStream');

class AudioRecording extends events.EventEmitter {
  constructor() {
    super(...arguments);
    this.started = false;
    this.ended = false;
    this[socketStreamSymbol] = ss.createStream();
    console.log(this);
  }

  meta(thing) {
    thing.timestamp = this.timeSinceStart;
    this.emit('meta', thing);
    socket.emit('audio-meta', thing);
  }

  get timeSinceStart() {
    return Date.now() - this.timeStart;
  }

  start() {
    this.emit('start');
    this.started = true;
    this.timeStart = Date.now();
    navigator.getUserMedia_({ audio: true }, stream => {
      ss(socket).emit('audio-stream', this[socketStreamSymbol], {
        timestamp: this.timeStart
      });
      this[streamSymbol] = stream;
      var context = new AudioContext();
      var audioInput = context.createMediaStreamSource(stream);
      // create a javascript node
      var recorder = context.createScriptProcessor(2048, 1, 1);
      // specify the processing function
      recorder.onaudioprocess = recorderProcess.bind(this);
      // connect stream to our recorder
      audioInput.connect(recorder);
      // connect our recorder to the previous destination
      recorder.connect(context.destination);
    }, console.error.bind(console));
  }

  end() {
    this.emit('end');
    this.ended = true;
    if(this[streamSymbol]) {
      this[socketStreamSymbol].end();
      this[streamSymbol].stop();
    }
  }
}

module.exports = AudioRecording;

window.AudioRecording = AudioRecording;