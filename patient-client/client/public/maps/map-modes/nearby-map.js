import { confirmExecutionConditions, currentRadius, generateInfoWindowUtils, updateRadius, manageNearbyQueryRequest, getZoomLevel } from '../map-utils.js'

/* eslint-disable no-undef */
let nearbyMap = -1
let service

let userGlobalCoordinates = -1

let directionsService
let directionsRenderer
let selectedDentalClinicMarker = null

let currentTravelMode = 'Driving'

async function initMap() {
  if (confirmExecutionConditions('Nearby')) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      userGlobalCoordinates = { lat: latitude, lng: longitude }

      manageNearbyQueryRequest() // Once the application is started, we send a request to query Clinic Service's database to retrieve the clinic-markers to display on the map
    })
  }
}

async function drawNearbyMap() {
  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')
  initiateMap(Map, AdvancedMarkerElement)
}

function listenForMarkerClickNearbyMode(marker, clinic) {
  google.maps.event.addListener(marker, 'click', function () {
    selectedDentalClinicMarker = marker.position

    generateInfoWindowUtils(clinic, marker, nearbyMap)
    calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer)
  })
}

function calcRoute(userGlobalCoordinates, dentistDestination, directionsService, directionsRenderer) {
  if (dentistDestination !== null) {
    const request = {
      origin: userGlobalCoordinates,
      destination: dentistDestination,
      travelMode: google.maps.TravelMode[currentTravelMode.toUpperCase()]
    }
    directionsService.route(request, function (response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response)
      } else if (status === 'ZERO_RESULTS') {
        alert('Google API could not generate route to desired destination')
      }
    })
  }
}

function createUserPositionMarker(AdvancedMarkerElement) {
  const userIcon = document.createElement('img')
  userIcon.src = 'https://i.ibb.co/cFB7cMR/User-Marker-Icon.png'

  // The marker that represents user's current global position
  const marker = new AdvancedMarkerElement({
    map: nearbyMap,
    position: userGlobalCoordinates,
    content: userIcon,
    title: 'Your Position'
  })
  console.log(marker)
}

function initiateMap(Map, AdvancedMarkerElement) {
  nearbyMap = new Map(document.getElementById('map'), {
    zoom: getZoomLevel(),
    center: userGlobalCoordinates,
    mapId: 'DEMO_MAP_ID'
  })

  createUserPositionMarker(AdvancedMarkerElement)
  initiateDirectionsComponents()

  updateRadius(service, nearbyMap, userGlobalCoordinates, currentRadius)
}

function initiateDirectionsComponents() {
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer()
  directionsRenderer.setMap(nearbyMap)
}

function changeTravelMode(newMode) {
  currentTravelMode = newMode
}

function deselectClinicMarker() {
  selectedDentalClinicMarker = null
}

initMap()
export {
  initMap, nearbyMap, calcRoute, userGlobalCoordinates, selectedDentalClinicMarker,
  directionsService, directionsRenderer, drawNearbyMap, changeTravelMode, deselectClinicMarker, listenForMarkerClickNearbyMode
}
