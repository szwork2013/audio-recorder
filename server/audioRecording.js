const wav = require('wav');
const fs = require('fs');
const fileWriterSym = Symbol('fileWriter');
const ee = require('events');
/**
 * takes a stream and puts it into a wav
 * exposes an end method and a filename prop
 */

const metaSymbol = Symbol('metadata');

const baseDir = __dirname + '/audio-files';

class AudioRecording extends ee {
  constructor() {
    super(...arguments);
    this[metaSymbol] = [];
    this.ended = false;
    this.started = false;
  }

  setId(id) {
    if(this.id) { throw new Error('id already set'); }
    this.id = id;
  }

  start(stream) {
    if(!this.id) { throw new Error('cannot start without id'); }
    this.started = true;
    this[fileWriterSym] = new wav.FileWriter(baseDir + '/' + this.fileName, {
      channels: 1,
      sampleRate: 48000,
      bitDepth: 16
    });
    stream.pipe(this[fileWriterSym]);

    stream.on('end', this.end.bind(this));
    this.emit('start');
  }

  meta(thing) {
    if(!this.started) { return; }
    if(this.ended) { return; }
    this[metaSymbol].push(thing);
  }

  end() {
    if(this.ended) { return; }
    if(!this.started) { return; }
    this.ended = true;
    this[fileWriterSym].end();
    // fs.writeFile(baseDir + '/' + this.id + '.json', JSON.stringify(this[metaSymbol]), console.log.bind(console));
    this.emit('end', this[metaSymbol]);
  }

  get fileName() {
    return `${this.id}.wav`;
  }
}

module.exports = AudioRecording;