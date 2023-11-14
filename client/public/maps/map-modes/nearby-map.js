import { zoomLevel } from '../../intermediaryExecutor.js'
// import { confirmExecutionConditions } from '../map-utils.js'

// TODO: Export variables from map-utils.js to this script and search-map.js

/* eslint-disable no-undef */
let graphicalMap = -1
let service

let userGlobalCoordinates
let directionsService
let directionsRenderer
let selectedDentalClinicMarker

// let zoomLevelTest = 12

async function initMap() {
  const pathArray = window.location.href.split('/')
  const lastSubDomainPath = pathArray[pathArray.length - 1]
  if (lastSubDomainPath === 'map' && document.getElementById('mode-data').innerHTML === 'NEARBY') { // confirmExecutionConditions('NEARBY')
    console.warn('in nearby-map.js')

    /*
    if (graphicalMap !== -1) {
      zoomLevelTest = graphicalMap.zoom
    }
    */

    navigator.geolocation.watchPosition(async position => {
      const { latitude, longitude } = position.coords
      userGlobalCoordinates = { lat: latitude, lng: longitude }
    })

    console.warn('A')

    directionsService = new google.maps.DirectionsService()
    directionsRenderer = new google.maps.DirectionsRenderer()

    console.warn('B')

    // launchMapUtils(userGlobalCoordinates)
    drawMap(userGlobalCoordinates) // Try passing directionsService and Renderer here: new google.maps.{service}
  }
}

async function drawMap(userGlobalCoordinates) {
  console.warn('drawMap()')
  // @ts-ignore
  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

  console.warn('C')
  // console.warn(zoomLevel)
  console.warn('D')

  graphicalMap = new Map(document.getElementById('map'), {
    zoom: zoomLevel, // zoomLevelTest
    center: userGlobalCoordinates,
    mapId: 'DEMO_MAP_ID'
  })

  // --------------------

  directionsRenderer.setMap(graphicalMap)
  let selectedRadius = document.getElementById('radius-data').innerHTML

  if (!selectedRadius) {
    selectedRadius = 10000 // Default value
  }

  const request = {
    location: userGlobalCoordinates,
    radius: selectedRadius,
    type: ['dentist']
  }

  service = new google.maps.places.PlacesService(graphicalMap)
  service.nearbySearch(request, callback)

  const userIcon = document.createElement('img')
  userIcon.src = 'https://i.ibb.co/cFB7cMR/User-Marker-Icon.png'

  // The marker that represents user's current global position
  const marker = new AdvancedMarkerElement({
    map: graphicalMap,
    position: userGlobalCoordinates,
    content: userIcon,
    title: 'Your Position'
  })

  console.log(marker)
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i])
    }
  }
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map: graphicalMap,
    position: place.geometry.location
  })

  google.maps.event.addListener(marker, 'click', function () {
    selectedDentalClinicMarker = marker.position

    const ratingString = place.rating ? 'Rating: ' + place.rating + ` by ${place.user_ratings_total} users` : ''
    // console.warn(place.photos[0].getUrl()) // NOTE: Some dentists have pics and some not

    const infowindow = new google.maps.InfoWindow()

    infowindow.setContent(
      `<strong class="header">${place.name}</strong>
      <p>
      Adress: ${place.vicinity} <br>
      ${ratingString}
      </p>
      <style>
      .header {
        font-weight: 1000
      }
      </style>`
    )
    infowindow.open(graphicalMap, marker)

    calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer)
    // calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, google.maps.DirectionsService(), directionsRenderer) // try with 'new' if error
  })
}

function calcRoute(userGlobalCoordinates, dentistDestination, directionsService, directionsRenderer) {
  const selectedMode = document.getElementById('travel-mode-data').innerHTML
  const request = {
    origin: userGlobalCoordinates,
    destination: dentistDestination,
    travelMode: google.maps.TravelMode[selectedMode]
  }
  directionsService.route(request, function (response, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(response)
    }
  })
}

initMap() //
export { initMap, graphicalMap, calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer }
