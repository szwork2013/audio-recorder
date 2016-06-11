const express = require('express');
const router = express.Router();
const helmet = require('helmet');
const bodyParser = require('body-parser');
module.exports = router;

router.use(helmet());
router.use(bodyParser.json());

router.use('/users', require('./user'));
router.use('/sessions', require('./session'));
router.use('/problems', require('./problem'));