/* eslint-disable no-return-assign */
/* eslint-disable promise/param-names */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable func-call-spacing */

// This script is the generalization of 'map.js' and 'search-map.js' and is executed at initialization of both scripts
/* eslint-disable no-undef */

import { listenForMarkerClickNearbyMode, nearbyMap, userGlobalCoordinates, drawNearbyMap } from './map-modes/nearby-map'
import { listenForMarkerClickSearchMode, searchMap, drawSearchMap, markerCoordinates } from './map-modes/search-map'
import { generateWindow } from './infowindow'
import { Api } from '../../src/Api.js'

let currentMapMode = 'Nearby'
let markers = []

// Two types of clinic quries:
let currentRadius = 10 // radius query
let currentQueryNumber // fixed number query

let clinicsData
let selectedQueryMode = 'radius' // Possible values: 'radius' and 'number'

const defaultZoomLevel = 12

/*
  Define pages to integrate MapComponent with.
  Note that the strings below starts with 'localhost:8080'.
  Adding a new element 'my/test/page/' would integrate the map
  functionality at 'localhost:8080/my/test/page/', assuming that you
  also add MapComponent.vue in its template
*/
const integratedVueRoutes = ['map']

/*
Each map-mode script is solely executed when their respective mode is activated by the user.
This check is important since the exporting and importing between the map-scripts invokes them in unwanted conditions.
*/
function confirmExecutionConditions(mapMode) {
  const pathArray = window.location.href.split('/')
  const lastSubDomainPath = pathArray[pathArray.length - 1]

  const isAllowedPage = integratedVueRoutes.includes(lastSubDomainPath)

  return (isAllowedPage === true && currentMapMode === mapMode)
}

function integrateAPIKey() {
  (g => { let h; let a; let k; const p = 'The Google Maps JavaScript API'; const c = 'google'; const l = 'importLibrary'; const q = '__ib__'; const m = document; let b = window; b = b[c] || (b[c] = {}); const d = b.maps || (b.maps = {}); const r = new Set(); const e = new URLSearchParams(); const u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement('script')); e.set('libraries', [...r, 'places'] + ''); for (k in g)e.set(k.replace(/[A-Z]/g, t => '_' + t[0].toLowerCase()), g[k]); e.set('callback', c + '.maps.' + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + ' could not load.')); a.nonce = m.querySelector('script[nonce]')?.nonce || ''; m.head.append(a) })); d[l] ? console.warn(p + ' only loads once. Ignoring:', g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })
  ({ key: 'AIzaSyBezKgTO8Fu1ymaIoAoToNn0g5ZMjgSR4Y', v: 'weekly' })
}

function changeMapMode(newMapMode) {
  currentMapMode = newMapMode
}

function changeRadius(newRadius) {
  currentRadius = newRadius
}

// Restore most recent zoom level every time the map is loaded
function getZoomLevel() {
  const map = currentMapMode === 'Nearby' ? nearbyMap : searchMap
  return map === -1 ? defaultZoomLevel : map.zoom
}

function createMarker(referenceCoordinates, clinic) {
  const marker = initializeMarker(referenceCoordinates)
  markers.push(marker)

  if (currentMapMode === 'Nearby') {
    listenForMarkerClickNearbyMode(marker, clinic)
  } else {
    listenForMarkerClickSearchMode(marker, clinic)
  }
}

function setMapOnAllMarkers(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map)
  }
}

function deleteMarkers() {
  setMapOnAllMarkers(null)
  markers = []
}

function initializeMarker(referenceCoordinates) {
  const currentMap = currentMapMode === 'Nearby' ? nearbyMap : searchMap

  return new google.maps.Marker({
    map: currentMap,
    position: referenceCoordinates
  })
}

/*
  Forward functionality to infowindow.js with aggregation with respect to encapsulation:
  The map-mode scripts only interacts with map.utils.js
*/
function generateInfoWindowUtils(clinic, marker, map) {
  generateWindow(clinic, map, marker)
}

// Update radius to query dental clinics in relative to a fixed position (user's pos or search-reference pos)
function updateRadius() {
  if (currentMapMode === 'Search') {
    drawSearchMap()
  }

  drawClinicMarkers()
}

function getReferencePosition() {
  const stringifiedCoordinates = (currentMapMode === 'Nearby') ? userGlobalCoordinates : markerCoordinates
  return stringifiedCoordinates.lat + ',' + stringifiedCoordinates.lng
}

// Create visual markers of every clinic that was sent in the payload from Clinic Service
function drawClinicMarkers(clinicFilter) {
  const clinicArray = clinicsData.clinics

  if (clinicFilter) {
    deleteMarkers()
  }

  if (clinicArray) {
    for (let i = 0; i < clinicArray.length; i++) {
      const currentClinic = clinicArray[i]

      if (filterClinic(clinicFilter, currentClinic) === 'true') {
        const positionArray = currentClinic.position.split(',')
        const referenceCoordinates = { lat: parseFloat(positionArray[0]), lng: parseFloat(positionArray[1]) }
        createMarker(referenceCoordinates, currentClinic)
      }
    }
  }
}

function filterClinic(clinicFilter, currentClinic) {
  if (clinicFilter) {
    return clinicFilter.has(currentClinic._id.$oid).toString()
  }
  return 'true'
}

// Potential values: 'radius' or 'number'
function setSelectedQueryMode(value) {
  selectedQueryMode = value
}

// Set the numerical value for the N-closest clinics
function setFixedQueryNumber(value) {
  currentQueryNumber = value
}

/*
 Note for developers: The data{} variables in MapComponent.vue cannot be read before the scripts
 initiates the map at the start of the application. Therefore, we use the function below to read
 the variables that constitute the query-settings to be performed in Clinic Service in this script,
 which is the 'main' script (the origin of the codeflow across all existing map-related scripts in
  this Patient Client component)
*/
function manageNearbyQueryRequest() { // Accounts for both types of queries (radius and N-closest clinics) and looks at user's input to decide what methods to execute
  const queryValue = (selectedQueryMode === 'radius') ? currentRadius : currentQueryNumber
  sendNearbyQueryRequest(selectedQueryMode, queryValue)
}

/*
  Note for developers:
  queryMode = 'radius' OR 'number'
  queryValue = { value with corresponding unit of measure of the specified queryMode ('radius' --> kilometers, 'number' --> N closest clinics) }
*/
async function sendNearbyQueryRequest(queryMode, queryValue) { // Sends the query-request to Patient API
  try {
    const queryUrl = `/clinics/${queryMode}/positions?${queryMode}=${queryValue}&coordinates=${getReferencePosition()}`
    const { data } = await Api.get(queryUrl)

    clinicsData = data
    updateMapUI()
  } catch (err) {
    console.error('Error when getting clinics', err)
  }
}

function updateMapUI() {
  if (currentMapMode === 'Nearby') {
    drawNearbyMap()
  } else {
    updateRadius()
  }
}

integrateAPIKey()

export {
  confirmExecutionConditions, changeMapMode, currentMapMode, changeRadius, currentRadius, getZoomLevel,
  generateInfoWindowUtils, drawClinicMarkers, updateRadius, getReferencePosition,
  selectedQueryMode, setSelectedQueryMode, manageNearbyQueryRequest, currentQueryNumber, setFixedQueryNumber,
  defaultZoomLevel, sendNearbyQueryRequest, clinicsData
}
