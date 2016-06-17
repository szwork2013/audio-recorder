const React = require('react');
const auth = require('../auth');
const stateHelper = require('../stateHelper');

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  reset() {
    this.setState({
      email: '',
      password: ''
    });
  }

  changeEmail(e) {
    this.setState({ email: e.target.value });
  }

  changePassword(e) {
    this.setState({ password: e.target.value });
  }

  submit(evt) {
    evt.preventDefault();
    return auth.login(this.state.email, this.state.password)
      .then(this.props.main.setCurrentUser.bind(this.props.main))
      .then(() => {
        const {location} = this.props;
        if(location.state && location.state.nextPathname) {
          return stateHelper.go(location.state.nextPathname);
        }
        stateHelper.go('/');
      })
      .finally(() => this.reset.bind(this));
  }

  render() {
    return (
      <div className="bg-navy aqua main-container p2 pt3">
        <form style={{width: '250px'}} className="mx-auto" onSubmit={this.submit.bind(this)}>
          <div>
            <input className="input" value={this.state.email} type="email" onChange={this.changeEmail.bind(this)} placeholder="Email"/>
          </div>
          <div>
            <input className="input" value={this.state.password} type="password" onChange={this.changePassword.bind(this)} placeholder="Password"/>
          </div>
          <div>
            <button className="btn btn-outline" type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

module.exports = Login;