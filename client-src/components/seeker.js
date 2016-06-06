const React = require('react');
const ReactDom = require('react-dom');

class Seeker extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.props.audioPlayback.toggle.bind(this.props.audioPlayback);
    this.seek = this.props.audioPlayback.seek.bind(this.props.audioPlayback);
    this.state = {
      duration: 0,
      time: 0,
      playing: false
    };
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.props.audioPlayback.on('time', seconds => {
      this.setState({ time: seconds});
    });
    this.props.audioPlayback.on('load', () => {
      this.setState({
        duration: this.props.audioPlayback.duration
      });
    });

    this.props.audioPlayback.on('pause', () => {
      this.setState({ playing: false })
    });

    this.props.audioPlayback.on('play', () => {
      this.setState({ playing: true })
    })
  }

  buttonText() {
    if(!this.state.playing) {
      return '\u25BA';
    } else {
      return '\u23F8';
    }
  }

  seekClick(evt) {
    // convert event object to time
    const seekerDiv = this.seekerDiv;
    const offsetPx = evt.pageX - seekerDiv.getBoundingClientRect().left;
    const seekRatio = offsetPx / seekerDiv.width
    const seconds = seekRatio * this.state.duration;
    this.seek(seconds);
  }

  timeToPx() {
    if(!this.state.duration) { return 0; }
    const ratio = this.state.time / this.state.duration;
    const width = this.seekerDiv.getBoundingClientRect().left;
    return width * ratio;
  }

  render() {
    return (
      <div className="seeker">
        <button onClick={this.toggle}>
          {this.buttonText()}
        </button>
        <div 
          className="seeker-bar"
          ref={div => this.seekerDiv = div}
          onClick={this.seekClick.bind(this)}>
            <div style={{ width: this.timeToPx.call(this) + 'px'}}></div>
        </div>
      </div>
    );
  }
}

module.exports = Seeker;