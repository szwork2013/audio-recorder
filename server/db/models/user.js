const passwordHasher = require('../../passwordHasher');
const connection = require('../connection');
const Row = require('../row');

const isEmail = email => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

class User extends Row {


  authenticate(pass) {
    return passwordHasher.compare(pass, this.password);
  }

  static create(obj) {
    return passwordHasher.hash(obj.password)
      .then(hash => obj.password = hash)
      .then(() => super.create(obj))
    // return super.create(obj);
  }

  static validate(diff, obj) {
    const checks = [
      {check: !!obj.password, msg: 'password missing'},
      {check: !!obj.email, msg: 'email missing'},
      {check: isEmail(obj.email), msg: 'email invalid'},
    ]
    return super.validate(diff, obj, checks);
  }
  
  get blacklist() {
    return ['password'];
  }
}


module.exports = User;