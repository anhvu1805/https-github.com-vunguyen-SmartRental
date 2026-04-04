const express = require('express');
const router = express.Router();
const serviceController = require('../src/controllers/serviceController');

router.get('/', serviceController.getAllServices);
router.post('/', serviceController.createService);

module.exports = router;