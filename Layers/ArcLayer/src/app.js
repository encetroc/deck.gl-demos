/*
 * Copyright 2019 Google LLC

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 *  https://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {map_styles} from './map_styles';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {ArcLayer} from '@deck.gl/layers';

/* SET YOU APIR KEY HERE OR IN GoogleMapsAPIKey ENV VAR */
const YOUR_API_KEY = '';

/*
 * Demo of ArcLayer that renders Chicago taxi trips 
 * between neighborhood centroid origin and destination points
 *
 * Datasource: Chicago Data Portal
 * https://data.cityofchicago.org/Transportation/Taxi-Trips/wrvz-psew
 */
function getArcLayer() {
  const DATA_URI = 'https://data.cityofchicago.org/resource/wrvz-psew.json',
        QS = '?$LIMIT=25000&$WHERE=pickup_centroid_latitude IS NOT NULL AND dropoff_centroid_latitude IS NOT NULL';

  const ARC_LAYER = new ArcLayer({
    id: 'arcs',
    data: DATA_URI + QS,
    getSourcePosition: f => [f.pickup_centroid_longitude, f.pickup_centroid_latitude],
    getTargetPosition: f => [f.dropoff_centroid_longitude, f.dropoff_centroid_latitude],
    getSourceColor: [0, 128, 200],
    getTargetColor: [255, 101, 101],
    getWidth: 0.5
  });

  return ARC_LAYER;
}

// Init the base map and deck.gl GoogleMapsOverlay, then add the layer
async function init() {
  await loadScript();
  const MAP = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.932875, lng: -87.761911},
    zoom: 12,
    styles: map_styles
  });

  const ARC_LAYER = getArcLayer();

  const overlay = new GoogleMapsOverlay({
    layers: [ARC_LAYER]
  });
  overlay.setMap(MAP);
}

// Load the Google Maps Platform JS API async
function loadScript() {  
  const GOOGLE_MAPS_API_KEY = YOUR_API_KEY || process.env.GoogleMapsAPIKey,
        GOOGLE_MAPS_API_URI = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`,
        HEAD = document.querySelector('head'),
        SCRIPT = document.createElement('script');

  SCRIPT.type = 'text/javascript';
  SCRIPT.src = GOOGLE_MAPS_API_URI;
  HEAD.appendChild(SCRIPT);
  return new Promise(resolve => {
    SCRIPT.onload = resolve;
  });
}

init();