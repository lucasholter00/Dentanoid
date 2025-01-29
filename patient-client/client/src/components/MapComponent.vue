<template>
  <b-container class="fluid">
    <b-row>
      <b-col md="4" sm="12" class="my-2">
        <b-container id="map-options" class="p-4 rounded shadow">
          <b-row>
            <b-col>
              <b-form-group label="Map Mode">
                <b-form-select v-model="selectedMode" :options="searchModes"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <div v-if="selectedMode === 'Nearby'">
                <b-form-group label="Travel Mode">
                  <b-form-select v-model="currentTravelMode" :options="travelModes"></b-form-select>
                </b-form-group>
              </div>
            </b-col>
          </b-row>

          <b-form-group label="Select Query Mode">
            <b-form-select v-model="selectedNearbyQuery" :options="queryModes"></b-form-select>
          </b-form-group>

          <div v-if="selectedNearbyQuery === 'radius'">
            <b-form-group label="Query Radius">
              <b-form-select v-model="currentRadius" :options="options"></b-form-select>
            </b-form-group>
          </div>

          <div v-if="selectedNearbyQuery === 'number'">
            <strong>Query Number:</strong>
            <b-form-select v-model="currentNumberQuery" :options="radii"></b-form-select>
          </div>
        </b-container>

        <div class="map-search-mode" v-if="selectedMode === 'Search'">
          <div class="pac-card" id="pac-card">
            <div>
              <div id="title">Search for reference position</div>
              <div id="type-selector" class="pac-controls">
                <input type="radio" name="type" id="changetype-all" checked="checked" />
                <label for="changetype-all">All</label>
                <input type="radio" name="type" id="changetype-establishment" />
                <label for="changetype-establishment">establishment</label>

                <input type="radio" name="type" id="changetype-address" />
                <label for="changetype-address">address</label>

                <input type="radio" name="type" id="changetype-geocode" />
                <label for="changetype-geocode">geocode</label>

                <input type="radio" name="type" id="changetype-cities" />
                <label for="changetype-cities">(cities)</label>

                <input type="radio" name="type" id="changetype-regions" />
                <label for="changetype-regions">(regions)</label>
              </div>
              <br />
              <div id="strict-bounds-selector" class="pac-controls">
                <input type="checkbox" id="use-location-bias" value="" checked />
                <label for="use-location-bias">Bias to map viewport</label>

                <input type="checkbox" id="use-strict-bounds" value="" />
                <label for="use-strict-bounds">Strict bounds</label>
              </div>
            </div>
            <div id="pac-container">
              <input id="pac-input" type="text" placeholder="Enter a location" />
            </div>
          </div>
          <div id="infowindow-content">
            <span id="place-name" class="title"></span><br />
            <span id="place-address"></span>
          </div>
        </div>
      </b-col>
      <b-col md="8" sm="12" class="my-2">
        <div id="map" style="height: 300px;"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// Import necessary data from the map scripts (map-utils.js, nearby-map.js and search-map.js)
import {
  calcRoute, userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer,
  initMap, changeTravelMode, deselectClinicMarker
} from '../../public/maps/map-modes/nearby-map.js'

import { initSearchMap } from '../../public/maps/map-modes/search-map.js'

import {
  changeMapMode, changeRadius, sendNearbyQueryRequest,
  setSelectedQueryMode, manageNearbyQueryRequest, setFixedQueryNumber
} from '../../public/maps/map-utils.js'

// Import necessary data from other scripts that are not related to the map functionalities
import { createHTMLScriptElement } from '../utils.js'

export default {
  name: 'MapComponent',
  data() {
    return {
      /*
       'CURRENT' variables:
       These variables stores the current state of the application.
       Many of these are synchronized with variables in map-utils.js.
      */
      currentTravelMode: 'Driving',
      currentRadius: 10,
      selectedMode: 'Nearby', // This varible is needed to register current mode in thr HTML above, when 'currentMapMode' from map-utils.js cannot be read at instantiation of app
      selectedNearbyQuery: 'radius',
      currentNumberQuery: '5',

      /*
        'UI' variables:
        These variables are directly changed by the user through the UI interactions
      */
      options: [
        { value: 0.25, text: '0.25 KM' },
        { value: 0.5, text: '0.5 KM' },
        { value: 1, text: '1 KM' },
        { value: 3, text: '3 KM' },
        { value: 5, text: '5 KM' },
        { value: 10, text: '10 KM' },
        { value: 15, text: '15 KM' },
        { value: 20, text: '20 KM' },
        { value: 30, text: '30 KM' },
        { value: 50, text: '50 KM' },
        { value: 100, text: '100 KM' },
        { value: 2000, text: '2000 KM' }
      ],
      radii: [
        { value: 1, text: '1' },
        { value: 3, text: '3' },
        { value: 5, text: '5' },
        { value: 7, text: '7' },
        { value: 10, text: '10' },
        { value: 15, text: '15' },
        { value: 20, text: '20' },
        { value: 30, text: '30' },
        { value: 50, text: '50' }
      ],
      queryModes: ['number', 'radius'],
      travelModes: ['Driving', 'Walking', 'Bicycling', 'Transit'],
      searchModes: ['Nearby', 'Search']
    }
  },
  created() {
    this.initializeNearbyMap()
  },
  methods: {
    /*
     The methods 5 methods below represent on-click events
     directly connected to the interaction with a front-end element.
    */
    async changeSearchRange() { // Dropdown button is pressed to change radius of displayed clinics
      changeRadius(this.currentRadius)
      setSelectedQueryMode('radius')
      deselectClinicMarker()
      sendNearbyQueryRequest('radius', this.currentRadius)
    },
    toggleTravelMode() { // Dropdown button is pressed to change the display of travel-route types available in 'NEARBY' mode
      changeTravelMode(this.currentTravelMode)
      calcRoute(userGlobalCoordinates, selectedDentalClinicMarker, directionsService, directionsRenderer)
    },
    async sendClinicNumberQuery() {
      setSelectedQueryMode('number')
      setFixedQueryNumber(this.currentNumberQuery)
      sendNearbyQueryRequest('number', this.currentNumberQuery)
    },
    nearbyMode() {
      this.connectMap('Nearby')
    },
    searchMode() {
      this.connectMap('Search')
    },
    /*
     The methods below are indirectly connected to the interactions of
     front-end elements, meaning that they are invoked by the methods above.
    */
    updateMode(newMode) {
      this.selectedMode = newMode
      changeMapMode(newMode)
    },
    connectMap(mapType) {
      this.updateMode(mapType)
      if (mapType === 'Nearby') {
        initMap()
      } else {
        setTimeout(() => initSearchMap(), 0)
      }
      manageNearbyQueryRequest()
    },
    // Run 'nearby-map.js'
    initializeNearbyMap() {
      createHTMLScriptElement(this.getPathToMapModeScript('nearby-map.js'), false)
    },

    /*
    Note for developers: If we want to activate 'SEARCH' mode at start of aplication,
    we run this method in 'created()' instead of the method above, and change
    'currentMapMode' in map-utils.js to 'SEARCH'
    */
    initializeSearchMap() { // Run 'search-map.js'
      createHTMLScriptElement(this.getPathToMapModeScript('search-map.js'), false)
    },
    getPathToMapModeScript(mapScript) { // The path from this component to the desired map-mode script (nearby-map.js or searchmap.js)
      return `../../public/maps/map-modes/${mapScript}`
    }
  },
  watch: {
    currentNumberQuery: function () {
      this.sendClinicNumberQuery()
    },
    currentRadius: function () {
      this.changeSearchRange()
    },
    selectedMode: function () {
      this.selectedMode === 'Search' ? this.searchMode() : this.nearbyMode()
    },
    currentTravelMode: function () {
      this.toggleTravelMode()
    }
  }
}
</script>

<style>
#nearby-query-panel {
  background-color: rgba(113, 113, 113, 0.784);
  border-radius: 2vw;
}

#query-mode-title {
  font-weight: 900;
}

#map-options {
  background-color: white;
}

.full-height {
  min-height: 80%;
  height: 80%;
}
</style>
