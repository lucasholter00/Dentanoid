// Email template for when new timeslots are published to clinics.
require('dotenv').config()

const newTimeslotsEmail = {
    from: process.env.EMAIL_SENDER,
    to: "", // to is populated later by emailController.
    subject: "There are new timeslots available!",
    html: `<style>
              body {
                  font-size: 20px;
                  text-align: center;
                  animation: slideIn 0.5s ease-in-out;
                  background-image: url('https://images.pexels.com/photos/298611/pexels-photo-298611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
                  padding: 10px;
                  border: 10px solid #007BFF;
                  border-radius: 10px;
                  margin: 10px;
                  background-size: cover; 
                  background-position: center; 
                  background-repeat: no-repeat; 
                  color: black;
                  font-family: 'Roboto', sans-serif;
                }
              img {
                max-width: 100%;
                height: auto;
              }
              h3 {
                  color: #007BFF;
                  font-size: 40px;
                }
              @keyframes slideIn {
                from {
                  transform: translateX(-100%);
                }
                to {
                  transform: translateX(0);
                }
              }
          </style>
          <body>
              <div>
                <h3>Hi!</h3>
                <p>New timeslots have been published at [clinic].</p>
                <p>Sign in to book your slot now - <a href="https://patient-dusky.vercel.app/">Dentanoid</a></p>
                <p>kind regards, Dentanoid</p>
              </div>
           </body>`
}

module.exports = {
    newTimeslotsEmail
}