const {newTimeslotsEmail} = require('../src/email/templates/newTimeslots')

console.log(newTimeslotsEmail)
test('newTimeslotsEmail is a constant with the expected value', () => {
  expect(newTimeslotsEmail).toStrictEqual({
    from: process.env.EMAIL_SENDER,
    to: "", // To will be inserted with a list from the database.
    subject: "There are new timeslots available!",
    text: "Hi! \n New timeslots have been published at your clinic. \n Sign in to book your slot now. \n kind regards, Dentanoid ",
    html: `<body>
              <div style="border-color: #0275D8; border-style: solid">
                <h3>Hi!</h3>
                <p>New timeslots have been published at your clinic.</p>
                <p>Sign in to book your slot now - <a href="https://patient-dusky.vercel.app/">Dentanoid</a></p>
                <p>kind regards, Dentanoid</p>
              </div>
           </body>`
});
});