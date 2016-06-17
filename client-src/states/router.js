const React = require('react');
const ReactDom = require('react-dom');
const ReactRouter = require('react-router');
const Route = ReactRouter.Route;
const Router = ReactRouter.Router;

const Login = require('./login');
const auth = require('../auth');
const Main = require('./main');
const Problems = require('./problems/index');
const NewProblem = require('./problems/new');

const requireAuth = (nextState, replace) => {
  if(!auth.loggedIn) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};

ReactDom.render(<Router history={ReactRouter.hashHistory}>
  <Route path="/" component={Main}>
    <Route path="/login" component={Login}></Route>
    <Route path='/problems' component={Problems} onEnter={requireAuth}></Route>
    <Route path='/problems/new' component={NewProblem} onEnter={requireAuth}></Route>
    <Route path="/record" onEnter={requireAuth} getComponent={(next, cb) => {
      require.ensure(['./recorder'], () => {
        cb(null, require('./recorder'))
      })
    }}></Route>
    <Route path="/play/:id" onEnter={requireAuth} getComponent={(next, cb) => {
      require.ensure(['./player'], () => {
        cb(null, require('./player'));
      })
    }}></Route>
  </Route>
</Router>,document.getElementById('app'));