// Import email templates and check that they include all the neccesary properties
const {newTimeslotsEmail} = require('../src/email/templates/newTimeslots')
const {bookingConfirmationEmail} = require('../src/email/templates/bookingConfirmation')
const {bookingCancellationEmail} = require('../src/email/templates/bookingCancellation')

test('newTimeslotsEmail is a email template expected to contain', () => {
    expect(newTimeslotsEmail).toHaveProperty('from')
    expect(newTimeslotsEmail).toHaveProperty('to')
    expect(newTimeslotsEmail).toHaveProperty('subject')
    expect(newTimeslotsEmail).toHaveProperty('html')
  })

  test('bookingConfirmationEmail is a email template expected to contain', () => {
    expect(bookingConfirmationEmail).toHaveProperty('from')
    expect(bookingConfirmationEmail).toHaveProperty('to')
    expect(bookingConfirmationEmail).toHaveProperty('subject')
    expect(bookingConfirmationEmail).toHaveProperty('html')
  })

  test('bookingCancellationEmail is a email template expected to contain', () => {
    expect(bookingCancellationEmail).toHaveProperty('from')
    expect(bookingCancellationEmail).toHaveProperty('to')
    expect(bookingCancellationEmail).toHaveProperty('subject')
    expect(bookingCancellationEmail).toHaveProperty('html')
  })