const server = require('./server');
const User = require('./models/user');

module.exports = {

}
class Auth {

  constructor() {
    if(this.token) {
      this.configureServer();
    }
  }

  configureServer() {
    server.config({
      headers: {
        Authorization: this.token
      }
    });
  }

  login(email,password) {
    return server.post('/api/sessions', { email, password})
      .then(jwt => window.localStorage.setItem('token', jwt.token))
      .then(() => this.configureServer())
      .then(() => this.getMe());
  }

  getMe() {
    return User.findById('me')
  }

  logout() {
    window.localStorage.removeItem('token');
  }

  get loggedIn() {
    return !!this.token;
  }

  get token() {
    return window.localStorage.getItem('token');
  }
}

module.exports = new Auth();