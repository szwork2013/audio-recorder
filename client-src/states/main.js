const React = require('react');
const ReactRouter = require('react-router');
const auth = require('../auth');
const Navigation = require('../components/navigation');
const Errors = require('../components/errors.js')

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: auth.loggedIn,
      currentUser: {},
      errors: []
    }

    this.addError = this.addError.bind(this);
    this.removeError = this.removeError.bind(this);
  }

  componentDidMount() {
    if(auth.loggedIn) {
      auth.getMe()
        .then(this.setCurrentUser.bind(this));
    }
  }

  addError(e) {
    console.error(e);
    this.setState(prev => {
      prev.errors.push(e);
      return prev;
    });
  }

  removeError(err) {
    this.setState(prev => {
      prev.errors = prev.errors.filter(e => e !== err);
      return prev;
    });
  }

  setCurrentUser(user) {
    this.setState({
      loggedIn: true,
      currentUser: user
    });
  }

  logout() {
    auth.logout();
    this.setState({
      loggedIn: false,
      currentUser: {}
    });
    this.props.history.push('/login');
  }

  render() {
    return (
      <div>
        <Navigation
          className="border-bottom aqua"
          loggedIn={this.state.loggedIn}
          main={this}/>
        
        <div className="">
          {React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              main: this
            });
          })}
        </div>
        <Errors main={this} errors={this.state.errors}/>
      </div>
      )
  }
}

module.exports = Main;
