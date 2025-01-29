const { registerClinic, addDentist, removeDentist, getClinics } = require('../controllers/clinicController');
const express = require('express');
const router = express.Router();

router.get('/', getClinics)
router.post('/', registerClinic);
router.post('/dentists', addDentist);

module.exports = router;