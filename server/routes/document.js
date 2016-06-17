const Document = require('../db/models/document');
const Controller = require('./controller');
const ctrl = new Controller();
const jwt = require('../jwt');
const express = require('express');
const router = express.Router();
module.exports = router;

router.use(jwt.expressMiddleware);

ctrl.regester('create', (req, res) => {
  res.status(201);
  return Document.create(req.body);
});

ctrl.regester('view', (req, res) => {
  return Document.findById(req.params.id);
});

ctrl.regester('index', (req, res) => {
  return Document.find(req.query);
});

ctrl.regester('remove', async (req, res) => {
  const document = await Document.findById(req.params.id);
  await document.remove();
});

ctrl.regester('update', async (req, res) => {
  const document = await Document.findById(req.params.id);
  Object.assign(document, req.body);
  res.status(201);
  return document.save();
});

router.post('/', ctrl.create);
router.get('/:id', ctrl.view);
router.put('/:id', ctrl.update);
router.get('/', ctrl.index);
router.delete('/:id', ctrl.remove);

