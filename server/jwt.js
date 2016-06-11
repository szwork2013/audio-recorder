const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./db/models/user');

exports.sign = obj => {
  return new Promise(function(resolve, reject) {
    jwt.sign(obj, config.jwt.secret, { expiresIn: '7d' }, function(err, token) {
      if(err) { return reject(err); }
      resolve(token);
    });
  });
};

exports.verify = token => {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, config.jwt.secret, function(err, obj) {
      if(err) { return reject(err); }
      resolve(obj);
    });
  });
};

exports.expressMiddleware =  async (req, res, next) => {

  try{
    if(!req.headers.authorization) {
      throw new Error('no jwt found');
    }
    const jwtVal = await exports.verify(req.headers.authorization);
    const user = await User.findById(jwtVal.id);
    req.user = user;
    next();
  } catch(e) {
    next(e);
  }

};
