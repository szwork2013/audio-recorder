const User = require('../db/models/user');
const Problem = require('../db/models/problem');
const express = require('express');
const Controller = require('./controller');
const ctrl = new Controller();
const jwt = require('../jwt');
const router = express.Router();
module.exports = router;

ctrl.regester('create', (req, res) => {
  res.status(201);
  return User.create(req.body);
});

ctrl.regester('me', (req, res) => {
  return Promise.resolve(req.user);
});

ctrl.regester('userProblems', (req, res) => {
  return Problem.find({ user_id: req.params.id });
});

router.post('/', ctrl.create);

router.use(jwt.expressMiddleware);

router.get('/me', ctrl.me);
router.get('/:id/problems', ctrl.userProblems);

