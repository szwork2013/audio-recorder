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
    this.id = Date.now();
    this.ended = false;
    this.started = false;
  }

  start(stream) {
    console.log('start fired!')
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
    console.log('meta called!');
    if(!this.started) { return; }
    if(this.ended) { return; }
    this[metaSymbol].push(thing);
  }

  // processMeta() {
  //   return this[metaSymbol].reduce((metaObj, current) => {
  //     const roundedTimestamp = Math.floor(current.timestamp / 10) * 10;
  //     if(metaObj[roundedTimestamp]) {
  //       metaObj[roundedTimestamp].push(current);
  //     } else {
  //       metaObj[roundedTimestamp] = [current];
  //     }
  //     return metaObj;
  //   }, {});
  // }

  end() {
    console.log('end fired!')
    if(this.ended) { return; }
    if(!this.started) { return; }
    this.ended = true;
    this[fileWriterSym].end();
    fs.writeFile(baseDir + '/' + this.id + '.json', JSON.stringify(this[metaSymbol]), console.log.bind(console));
    this.emit('end');
  }

  get fileName() {
    return `${this.id}.wav`;
  }

}

module.exports = AudioRecording;