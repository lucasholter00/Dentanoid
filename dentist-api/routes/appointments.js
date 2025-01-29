const express = require('express');
const router = express.Router();
const { getUsersAppointments, createAvailableTime, deleteAvailableTime, getAllTimeSlots } = require('../controllers/availableTimeController');

/* GET appointments with matching patientID. */
router.get('/users/:patientID', getUsersAppointments);

/* POST appointment using a patientID and appointmentID*/
router.post('/', createAvailableTime);

/* DELETE appointment using a appointmentID*/
// router.delete('/:appointmentID', cancelAppointment); // <--- Refactored version
router.delete('/:id', deleteAvailableTime);

/* GET all free and booked time slots pretaining to a dentist */
router.get('/:dentistID/all', getAllTimeSlots)
module.exports = router;
