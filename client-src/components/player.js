const React = require('react');
const ReactDom = require('react-dom');
const AudioPlayback = require('../audioPlayback');
const Seeker = require('./Seeker');
const Codemirror = require('react-codemirror');

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioPlayback: new AudioPlayback()
    }
    this.state.audioPlayback.load(this.props.params.id);
    this.setupEventListeners();
  }

  componentDidMount() {
    this.codeMirror = this.codeEditor.getCodeMirror();
  }

  setupEventListeners() {
    this.state.audioPlayback.on('seek', () => {
      // clear the codemirror editor!
    });

    this.state.audioPlayback.on('meta', this.processMetaEvent.bind(this));
  }

  processMetaEvent(evt) {
    console.log(evt);
    const handler = {
      change: evt => {
        this.codeMirror.doc.replaceRange(evt.text[0], evt.from, evt.to);
      },
      cursor: evt => {
        this.codeMirror.doc.setCursor(evt);
        this.codeMirror.scrollIntoView(evt);
      },
      selection: evt => {
        this.codeMirror.doc.setSelection(evt.ranges[0].anchor, evt.ranges[0].head);
      }//,
      // scroll: evt => {

      // }
    }[evt.evt] || function() {}

    return handler(evt);
  }

  render() {
    const options = {
        lineNumbers: true
    };
    return (
      <div>
        <Codemirror ref={el => this.codeEditor = el} value={this.state.code} options={options} />
        <Seeker audioPlayback={this.state.audioPlayback}/>
      </div>
    );
  }
}

module.exports = Player;