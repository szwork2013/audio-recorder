const events = require('events');

const audioElementSym = Symbol('audioElement');
const timeoutsSym = Symbol('timeouts');

class AudioPlayer extends events.EventEmitter {
  constructor() {
    super(...arguments);
    this[audioElementSym] = new Audio();
    this[timeoutsSym] = [];
  }

  play() {
    this.playing = true;
    this.setupFutureEvents();
    this.emit('play');
  }

  pause() {
    this.playing = false;
    this.clearFutureEvents();
    this.emit('pause');
  }

  toggle() {
    if(this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(time) {
    this.pause();
    if(time < 0 || time > this.duration) {
      throw new RangeError('seek time must be within audio bounds');
    }
    this.time = time;
    // we send out a seek event so that the client code can reset its state
    this.emit('seek', time);
    // then we re-emit all events leading up to this time so the client can re-apply them
    Object.keys(this.meta)
      .map(evtTime => Number(evtTime))
      .map(evtTime => evtTime / 100)
      .filter(evtTime => evtTime <= time)
      .forEach(evtTime => this.emitMetaEventsForTime(evtTime));
    this.play();
  }

  get playing() {
    return !this[audioElementSym].paused;
  }

  set playing(value) {
    if(value) {
      this[audioElementSym].play();
    } else {
      this[audioElementSym].pause();
    }
  }

  get time() {
    return this[audioElementSym].currentTime;
  }

  set time(val) {
    this[audioElementSym].currentTime = val;
  }

  get duration() {
    return this[audioElementSym].duration;
  }

  get finished() {
    return this.time >= this.duration
  }

  // emitMetaEventsForTime(time) {
  //   const metaObjs = this.meta[time];
  //   if(metaObjs) {
  //     metaObjs.forEach(metaObj => {
  //       this.emit('meta', metaObj)
  //     });
  //   }
  // }

  clearFutureEvents() {
    this[timeoutsSym].forEach(timeoutId => clearTimeout(timeoutId));
  }

  setupFutureEvents() {
    const pastEvents = this.meta.filter(evt => evt.timestamp/1000 < this.time);
    pastEvents.forEach(evt => {
      this.emit('meta', evt);
    });


    const futureEvents = this.meta.filter(evt => evt.timestamp/1000 >= this.time);
    futureEvents.forEach(evt => {
      const offset = evt.timestamp - this.time;
      this[timeoutsSym].push(setTimeout(() => {
        this.emit('meta', evt);
      }, offset));
    })
    // if(!this.playing) { return; }
    // if(this.finished) {
    //   return this.emit('finished');
    // }
    // this.emit('time', time);
    // this.emitMetaEventsForTime(time);
    // setTimeout(() => {
    //   this.checkForEvents(time + 10);
    // },10);
  }

  loadAudio(blob) {
    this[audioElementSym].src = URL.createObjectURL(blob);
  }

  load(id) {
    return Promise.all([
      fetch(`/audio/${id}.json`),
      fetch(`/audio/${id}.wav`)
    ])
    .then(files => {
      return Promise.all([
        files[0].json(),
        files[1].blob()
      ]);
    })
    .then(bodies => {
      return {
        meta: bodies[0],
        audioBlob: bodies[1]
      }
    })
    .then(data => {
      this.emit('loaded');
      Object.assign(this, data);
      this.loadAudio(data.audioBlob);
      return this;
    })
  }


}
module.exports = AudioPlayer;