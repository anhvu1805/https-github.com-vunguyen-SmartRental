const express = require('express');
const router = express.Router();
const contractController = require('../src/controllers/contractController');

router.get('/', contractController.getAllContracts);
router.post('/', contractController.createContract);

module.exports = router;