const User = require('../db/models/user');
const express = require('express');
const Controller = require('./controller');
const ctrl = new Controller();
const router = express.Router();
module.exports = router;

ctrl.regester('create', (req, res, next) => {
  res.status(201);
  return User.create(req.body);
});

router.post('/', ctrl.create);

