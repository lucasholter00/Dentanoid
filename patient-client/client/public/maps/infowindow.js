/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable promise/param-names */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable func-call-spacing */

import { getMeasurementInHalfQuantities, cutStringByMaxLengthAndDelimiter } from '../../src/utils'

const infoWindowMaxCharacters = 30
let selectedDentistInfowindow

let photoChunk
let addressChunk
let ratingsChunk
let employeesChunk
let employeesStyleChunk

/*
  The two different values in which the employee-list is positioned, depending on whether
  the clinic-photo was successfully fetched. If a photo is retrieved from the DB, space in the
  infowindow must be accommodated for it.
*/
const employeeUIPositionsX = ['130', '10']
const employeeUIPositionsY = ['55', '2']

// Display the related information about the clicked dental clinic marker in a window positioned at the selected dental clinic marker
function generateWindow(clinic, map, marker) {
  deselectPreviouslyActivatedWindow()
  assignHtmlVariables(clinic)
  displayWindowUI(map, marker, getWindowContent(clinic))
}

function deselectPreviouslyActivatedWindow() {
  if (selectedDentistInfowindow) {
    selectedDentistInfowindow.close()
  }
}

function getWindowContent(clinic) {
  return `<strong class="clinic-title"><i class="fa-solid fa-tooth"></i> ${clinic.clinic_name}</strong>
  ${photoChunk}
  <p>
  ${addressChunk}
  ${ratingsChunk}
    ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ
  ${employeesChunk}
  </p>
  <style>
  ${employeesStyleChunk}
  </style>`
}

function displayWindowUI(map, marker, contentString) {
  selectedDentistInfowindow = new google.maps.InfoWindow({
    content: contentString
  })

  selectedDentistInfowindow.open(map, marker)
}

function assignHtmlVariables(clinic) {
  photoChunk = getPhotoHtml(clinic)
  addressChunk = getAddressHtml(clinic)
  ratingsChunk = getRatingsHtml(clinic)
  employeesChunk = getEmployeesHtml(clinic)

  employeesStyleChunk = getEmployeesStyleChunk(clinic.photoURL)
}

/*
    Accounts for the case where a photo cannot be retrieved (e.g if the clinic is fictitous and not a real clinic
    with preexisting data that Google API can fetch)
*/
function getPhotoHtml(clinic) {
  const src = clinic.photoURL ? clinic.photoURL : 'https://upload.wikimedia.org/wikipedia/commons/7/70/Solid_white.svg'
  return `<div class="clinic-photo">
  <div style="float:right; width:20%;"><img src=${src} width="120" height="80"/></div>
  <div style="float:right; width:80%;margin-top: -19px;">
  </div>`
}

function getAddressHtml(clinic) {
  return clinic.address
    ? `<div class="clinic-address">
    <i class="fa-solid fa-location-dot"></i> Adress: ${cutStringByMaxLengthAndDelimiter(clinic.address, infoWindowMaxCharacters, ',')}
    </div>`
    : ''
}

function getRatingsHtml(clinic) {
  if (clinic.ratings) {
    const halfStarIcon = '<i class="fa-solid fa-star-half"></i>'
    const fullStarIcon = '<i class="fa-solid fa-star"></i>'
    const stars = getMeasurementInHalfQuantities(clinic.ratings, fullStarIcon, halfStarIcon)

    return `<div id="rating-string">
    <i class="fa-solid fa-circle-check"></i> Rating:
    </div>
    <div class="stars">
        ${stars}
    </div>`
  }

  return ''
}

function getEmployeesHtml(clinic) {
  return `<div class="clinic-employees">
  <i class="fa-solid fa-users"></i> Employees: ${getClinicEmployees(clinic)}
  </div>`
}

// Returns the employee names in seperate rows in HTML format
function getClinicEmployees(clinic) {
  let clinicEmployees = '<br>'
  clinic.employees.forEach((element) => clinicEmployees += element.dentist_name + '<br>')
  return clinicEmployees
}

function getEmployeesPosX(photoURL) {
  return photoURL ? employeeUIPositionsX[0] : employeeUIPositionsX[1]
}

function getEmployeesPosY(photoURL) {
  return photoURL ? employeeUIPositionsY[0] : employeeUIPositionsY[1]
}

function getEmployeesStyleChunk(photoURL) {
  return `.clinic-employees {
    position: absolute;
    left: ${getEmployeesPosX(photoURL)}px;
    top: ${getEmployeesPosY(photoURL)}px;
  }`
}

export { generateWindow }
