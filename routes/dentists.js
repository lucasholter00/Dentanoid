const express = require('express');
const router = express.Router();
const { getDentists, getDentist } = require('../controllers/dentistController');

// GET dentists all dentists or a subset of dentists
router.get('/get', getDentists);

// GET dentist with dentistID
router.get('/get/:dentistsID', getDentist);

module.exports = router;