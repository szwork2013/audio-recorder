const server = require('../server');
const catNap = require('cat-nap');

class User extends catNap.Model {}

User.schema = new catNap.Schema({
  id: { primary: true, validators: ['required'] },
  email: { type: String, validators: ['email', 'required'] },
  name: { type: String, validators: ['required'] }
});

class UserEndpoint extends catNap.Endpoint {}

UserEndpoint.model = User;
UserEndpoint.server = server;
UserEndpoint.path = '/api/users';

module.exports = UserEndpoint;