const bcrypt = require('bcrypt');
exports.hash = password => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if(err) { return reject(err); }
    bcrypt.hash(password, salt, (err, hash) => {
      if(err) { return reject(err); }
      resolve(hash);
    })
  });
});

exports.compare = (password, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(password, hash, (err, res) => {
    if(err) { return reject(err); }
    resolve(res);
  });
});