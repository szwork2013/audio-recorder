const User = require('../db/models/user');
const Controller = require('./controller');
const jwt = require('../jwt');
const express = require('express');
const router = express.Router();
module.exports = router;

const ctrl = new Controller();
ctrl.regester('create', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const isLoggedIn = await user.authenticate(req.body.password);
  if(!isLoggedIn) {
    throw new Error('incorrect email or password');
  }
  const token = await jwt.sign({ id: user.id });
  res.status(201);
  return { token };
});

router.post('/', ctrl.create);

