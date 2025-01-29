const express = require('express');
const router = express.Router();
const { getDentists, getDentist } = require('../controllers/dentistController');

// GET dentists all dentists or a subset of dentists
router.get('/', getDentists);

// GET dentist with dentistID
router.get('/:dentist_id', getDentist);

module.exports = router;