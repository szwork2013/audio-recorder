const React = require('react');
const ReactDom = require('react-dom');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const Route = ReactRouter.Route;
const Router = ReactRouter.Router;

const Recorder = require('./recorder');
const Player = require('./player');



class Main extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to={`/record`}>Record</Link>
        </nav>
        <div>{this.props.children}</div>
      </div>
      )
  }
}

ReactDom.render(<Router>
  <Route path="/" component={Main}>
    <Route path="/record" component={Recorder}></Route>
    <Route path="/play/:id" component={Player}></Route>
  </Route>
</Router>,document.getElementById('app'));