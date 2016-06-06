const React = require('react');
const AudioRecording = require('../audioRecording');
const Codemirror = require('react-codemirror');

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.audioRecording = new AudioRecording();
    this.state = {
      // audioRecording: new AudioRecording(),
      recording: false,
      ended:false,
      code: ''
    };
    
    this.start = this.audioRecording.start.bind(this.audioRecording)
    this.end = this.audioRecording.end.bind(this.audioRecording)
    this.meta = this.audioRecording.meta.bind(this.audioRecording)

    this.setupEventListeners();
  }

  componentDidMount() {
    this.codeMirror = this.codeEditor.getCodeMirror();
    this.setupCodeMirrorEventListeners();
  }

  setupCodeMirrorEventListeners() {
    this.codeMirror.on('cursorActivity', (codeMirror) => {
      const evt = Object.assign({ evt: 'cursor' }, codeMirror.doc.getCursor());
      this.meta(evt);
    });

    this.codeMirror.on('beforeSelectionChange', (codeMirror, ranges, update) => {
      const evt = Object.assign({ evt: 'selection' }, ranges);
      this.meta(evt);
    });

    this.codeMirror.on('change', (codeMirror, change) => {
      const evt = Object.assign({ evt: 'change' }, change);
      this.meta(evt);
    });

    this.codeMirror.on('scroll', codeMirror => {
      const evt = Object.assign({ evt: 'scroll' }, codeMirror.getScrollInfo());
      this.meta(evt);
    });
  }

  restart() {
    this.audioRecording = new AudioRecording();
    this.setState({
      recording: false,
      ended:false
    });
  }

  setupEventListeners() {
    this.audioRecording.on('start', () => {
      console.log('start event')
      this.setState({
        recording: true,
      });
    });

    this.audioRecording.on('end', this.restart.bind(this));
  }


  render() {
    const options = {
        lineNumbers: true
    };
    return (
      <div>
        <button disabled={this.state.recording} onClick={this.start.bind(this)}>Start</button>
        <button disabled={!this.state.recording} onClick={this.end.bind(this)}>End</button>

        <Codemirror ref={el => this.codeEditor = el} value={this.state.code} options={options} />
      </div>
    );
  }
}

module.exports = Recorder;