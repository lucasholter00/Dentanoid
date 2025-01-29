import {
  confirmExecutionConditions, currentRadius, generateInfoWindowUtils, updateRadius,
  manageNearbyQueryRequest, getZoomLevel, defaultZoomLevel
} from '../map-utils'

/* eslint-disable no-undef */
let service
let directionsServiceSearch
let directionsRendererSearch

let selectedDentalClinicMarkerSearch
let userMarker

let infowindowSearchReference
let infowindowContentSearchReference

let markerCoordinates = { lat: 40.749933, lng: -73.98633 } // Arbitrary start position: New York

/*
Note for developers:
The variable below is used only for the purpose of sending 'lat,lng' payload in string format, since
'markerCoordinates = searchedPlace.geometry.location' invokes Google's
internal functions and ceases to storing the location as a simple string
*/
// let referenceMarkerCoordinates = { lat: 40.749933, lng: -73.98633 }

let searchMap = -1
let searchedPlace
let autocomplete

let input
let biasInputElement
let strictBoundsInputElement

function initSearchMap() {
  if (confirmExecutionConditions('Search')) {
    drawSearchMap()

    readSearchBarElements()
    instantiateInfowindow()

    updateRadius(service, searchMap, markerCoordinates, currentRadius)
    onSearchLocation()
  }
}

// The info-window for the marker positioned according to the input of the search-prompt
function instantiateInfowindow() {
  infowindowSearchReference = new google.maps.InfoWindow()
  infowindowContentSearchReference = document.getElementById('infowindow-content')
  infowindowSearchReference.setContent(infowindowContentSearchReference)
}

function updateInfowindow() {
  infowindowContentSearchReference.children['place-name'].textContent = searchedPlace.name
  infowindowContentSearchReference.children['place-address'].textContent =
          searchedPlace.formatted_address
  infowindowSearchReference.open(searchMap, userMarker)
}

// Has responsibility for the functionality of the clickable buttons that restrict the search results
function runSearchBarButtonListeners() {
  runRadioButtonListeners()
  runCheckBoxListeners()
}

function runRadioButtonListeners() {
  setupClickListener('changetype-all', [])
  setupClickListener('changetype-address', ['address'])
  setupClickListener('changetype-establishment', ['establishment'])
  setupClickListener('changetype-geocode', ['geocode'])
  setupClickListener('changetype-cities', ['(cities)'])
  setupClickListener('changetype-regions', ['(regions)'])
}

// Sets a listener on a radio button to change the filter type when using the search bar
function setupClickListener(id, types) {
  const radioButton = document.getElementById(id)

  if (radioButton) {
    radioButton.addEventListener('click', () => {
      autocomplete.setTypes(types)
      input.value = ''
    })
  }
}

function runCheckBoxListeners() {
  runBiasInputListener()
  runStrictBoundsInputListener()
}

// Register if user wants to use 'bias input' setting in searchbar
function runBiasInputListener() {
  if (biasInputElement) {
    biasInputElement.addEventListener('change', () => {
      if (biasInputElement.checked) {
        autocomplete.bindTo('bounds', searchMap)
      } else {
        // User wants to turn off location bias, so three things need to happen:
        // 1. Unbind from map
        // 2. Reset the bounds to whole world
        // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
        autocomplete.unbind('bounds')
        autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 })
        strictBoundsInputElement.checked = biasInputElement.checked
      }
      input.value = ''
    })
  }
}

// Register if user wants to use 'strict bounds' in searchbar
function runStrictBoundsInputListener() {
  if (strictBoundsInputElement) {
    strictBoundsInputElement.addEventListener('change', () => {
      autocomplete.setOptions({
        strictBounds: strictBoundsInputElement.checked
      })
      if (strictBoundsInputElement.checked) {
        biasInputElement.checked = strictBoundsInputElement.checked
        autocomplete.bindTo('bounds', searchMap)
      }
      input.value = ''
    })
  }
}

function readSearchBarElements() {
  input = document.getElementById('pac-input')
  biasInputElement = document.getElementById('use-location-bias')
  strictBoundsInputElement = document.getElementById('use-strict-bounds')
}

// When user enters a search command in the search-prompt
function onSearchLocation() {
  instantiateSearchAutoComplete()
  runSearchBarListeners()
}

function runSearchBarListeners() {
  runSearchInputListener()
  runSearchBarButtonListeners()
}

function runSearchInputListener() {
  autocomplete.addListener('place_changed', () => {
    infowindowSearchReference.close()
    searchedPlace = autocomplete.getPlace()
    manageSearchResult()
  })
}

function getSearchQueryParameters() {
  return {
    fields: ['formatted_address', 'geometry', 'name'],
    strictBounds: false
  }
}

function instantiateSearchAutoComplete() {
  autocomplete = new google.maps.places.Autocomplete(input, getSearchQueryParameters())
  autocomplete.bindTo('bounds', searchMap)
}

function manageSearchResult() {
  // Place found
  if (searchIsValid()) {
    markerCoordinates = { lat: searchedPlace.geometry.viewport.eb.lo, lng: searchedPlace.geometry.viewport.La.lo }

    manageNearbyQueryRequest()
    directionsRendererSearch.setMap(searchMap)

    centerSearchedMarker()
    updateRadius(service, searchMap, markerCoordinates, currentRadius)
    updateInfowindow()
  } else { // Could not find place
    window.alert("No details available for input: '" + searchedPlace.name + "'")
  }
}

// Check if an existing place can be found based on the user's input
function searchIsValid() {
  return (searchedPlace.geometry && searchedPlace.geometry.location)
}

function centerSearchedMarker() {
  if (searchedPlace.geometry.viewport) {
    searchMap.fitBounds(searchedPlace.geometry.viewport)
  } else {
    searchMap.setCenter(searchedPlace.geometry.location)
    searchMap.setZoom(defaultZoomLevel)
  }
  userMarker.setPosition(searchedPlace.geometry.location)
}

// Checks if user clicks on dental clinic marker
function listenForMarkerClickSearchMode(marker, clinic) {
  google.maps.event.addListener(marker, 'click', function () {
    selectedDentalClinicMarkerSearch = marker.position
    generateInfoWindowUtils(clinic, marker, searchMap)
  })
}

// Create the marker that represents the position in the search-prompt
function createSearchReferenceMarker() {
  const svgMarkerIcon = {
    path: 'M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
    fillColor: 'blue',
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 4,
    anchor: new google.maps.Point(0, 20)
  }

  userMarker = generateReferenceMarker(svgMarkerIcon)
}

function generateReferenceMarker(svgMarkerIcon) {
  return new google.maps.Marker({
    map: searchMap,
    icon: svgMarkerIcon,
    position: markerCoordinates
  })
}

function drawSearchMap() {
  searchMap = new google.maps.Map(document.getElementById('map'), {
    center: markerCoordinates,
    zoom: getZoomLevel(),
    mapTypeControl: false
  })

  createSearchReferenceMarker()
  initiateDirectionsComponents()
}

function initiateDirectionsComponents() {
  directionsServiceSearch = new google.maps.DirectionsService()
  directionsRendererSearch = new google.maps.DirectionsRenderer()
}

function changeRadiusSearch(newRadius) {
  radiusTestSearch = newRadius
}

window.initMap = initSearchMap
export {
  initSearchMap, searchedPlace, selectedDentalClinicMarkerSearch, directionsServiceSearch, directionsRendererSearch,
  markerCoordinates, changeRadiusSearch, listenForMarkerClickSearchMode, searchMap, drawSearchMap
}
