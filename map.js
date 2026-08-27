
// created by Gary Morton with help from Microsoft Copilot
// V3.00 - 26-Aug-2026

//////////////////////
// CONSTANTS & DATA //
//////////////////////

const COLOR_DEFAULT         = "#ffd700";
const COLOR_ATNO            = "#0000aa";
const COLOR_NATURA          = "#99ff99";
const COLOR_SCENIC_TRAIL    = "#66ccff";
const COLOR_NATIONAL_FOREST = "#228B22";
const COLOR_ARCHEOLOGICAL   = "#888888";
const COLOR_HIGHLIGHT       = "#ff0066";

const cyprusBounds = [
    [34.45, 32.15],
    [35.85, 34.65]
];

const regionNames = {
    "CY-PA": "Paphos",
    "CY-LA": "Larnaca",
    "CY-NI": "Nicosia",
    "CY-LE": "Limassol",
    "CY-FA": "Famagusta"
};

const illegalParks = new Set([
    "CY-0148","CY-0153","CY-0154","CY-0155","CY-0156",
    "CY-0158","CY-0159","CY-0160","CY-0161","CY-0163","CY-0164"
]);

const mcdLocations = [
    { name: "McDonald's Latsia (Nicosia)", address: "50, Archbishop Makarios III Avenue 2220, Latsia", lat: 35.111569, lon: 33.382533 },
    { name: "McDonald's Zenon", address: "Stratigou Timayia 6051 Larnaca", lat: 34.927703, lon: 33.615922 },
    { name: "McDonald's Livadia", address: "Pergamou 2, 7060 Livadia, Larnaca", lat: 34.949548, lon: 33.646622 },
    { name: "McDonald's Finikoudes", address: "Athenon 30-32, 6023 Larnaca", lat: 34.913614, lon: 33.637659 },
    { name: "McDonald's Athalassa", address: "98 Athalassis Street Strovolos 2024", lat: 35.144670, lon: 33.361581 },
    { name: "McDonald's Engomi", address: "Nikou Kranidioti 2 2411 Engomi, Nicosia", lat: 35.163540, lon: 33.330472 },
    { name: "McDonald's Lakatamia", address: "Agiou Georgiou Avenue 94, 2304 Lakatamia, Nicosia", lat: 35.112950, lon: 33.291368 },
    { name: "McDonald's Skarinou", address: "Plakota 12 7731 Skarinou", lat: 34.817677, lon: 33.360728 },
    { name: "McDonald's Paralimni", address: "1st April 243, Paralimni 5280", lat: 35.025959, lon: 33.983183 },
    { name: "McDonald's Limassol Germasogeia", address: "Georgiou Avenue 107, Germsogia, Limassol", lat: 34.700269, lon: 33.100592 },
    { name: "McDonald's Makariou", address: "161 Archibishop Makarios III Avenue Limassol 4190", lat: 34.687482, lon: 33.040479 },
    { name: "McDonald's Ayia Napa", address: "Nissi Avenue 5 5330 Ayia Napa", lat: 34.986238, lon: 33.998903 },
    { name: "McDonald's Polemidia", address: "Katsantoneon 20 Street Kato Polemidia 4154 Limassol", lat: 34.688393, lon: 33.009183 },
    { name: "McDonald's Protaras", address: "Protaras Avenue 5296 Paralimni", lat: 35.017875, lon: 34.047134 },
    { name: "McDonald's Zakaki", address: "Franklin Roosevelt 281, 3046 Zakaki, Limassol", lat: 34.656527, lon: 32.997901 },
    { name: "McDonald's Demokratias", address: "Demokratias Avenue 35, 8028 Paphos", lat: 34.776729, lon: 32.443837 },
    { name: "McDonald's Paphos", address: "Tombs of the Kings Ave, Paphos", lat: 34.769936, lon: 32.410241 }
];

const potaPolygons = {
    "CY-0002": "CY-0002-Troodos-National-Forest.geojson",
    "CY-0003": "CY-0003-Rizoelia-National-Forest.geojson",
    "CY-0004": "CY-0004-Polemidia-National-Forest.geojson",
    "CY-0005": "CY-0005-Petra-Tou-Romiou-National-Forest.geojson",
    "CY-0006": "CY-0006-Cape-Gkreko-National-Forest.geojson",
    "CY-0007": "CY-0007-Athalassa-National-Forest.geojson",
    "CY-0008": "CY-0008-Machairas-National-Forest.geojson",
    "CY-0009": "CY-0009-Akamas-National-Forest.geojson",
    "CY-0010": "CY-0010-Ayios-Nikandros-National-Forest.geojson",
    "CY-0011": "CY-0011-Pedagogiki-Akademia-National-Forest.geojson",
    "CY-0012": "CY-0012-Potamos-Liopetriou-National-Forest.geojson",
    "CY-0128": "CY-0128-Ayios-Demetrios-Park.geojson",
    "CY-0131": "CY-0131-Metochi-Kykkou-Park.geojson",
    "CY-0132": "CY-0132-Poiiton-kai-Pnevmatikon-Park.geojson",
    "CY-0133": "CY-0133-Ioanni-Hadjipavlou-Park.geojson",
    "CY-0138": "CY-0138-Anthoupolis-Park.geojson",
    "CY-0144": "CY-0144-Pyla-Beach-Park.geojson",
    "CY-0145": "CY-0145-Larnaka-Municipal-Garden-Park.geojson",
    "CY-0146": "CY-0146-Patyxeio-Park.geojson",
    "CY-0149": "CY-0149-Michalaki-Kousoulidi-Community-Park.geojson",
    "CY-0150": "CY-0150-Deftera-Community-Park.geojson",
    "CY-0151": "CY-0151-Andreas-Christou-Community-Park.geojson",
    "CY-0165": "CY-0165-Pikni-Forest-Reserve.geojson"
};

const naturaMap = {
    "CY-0039": { code: "CY3000002", layer: 1, name: "Cape Gkreko SPA Natura 2000" },
    "CY-0060": { code: "CY4000010", layer: 0, name: "Akamas Peninsula Natura 2000" },
    "CY-0061": { code: "CY2000006", layer: 1, name: "Paphos Forest Natura 2000" },
    "CY-0062": { code: "CY2000013", layer: 1, name: "Periohi Kionia Natura 2000" },
    "CY-0063": { code: "CY6000010", layer: 1, name: "Oroklini Lake Natura 2000" },
    "CY-0064": { code: "CY3000008", layer: 0, name: "Paralimni Lake Natura 2000" },
    "CY-0065": { code: "CY3000007", layer: 1, name: "Achna Dam Natura 2000" },
    "CY-0066": { code: "CY2000015", layer: 1, name: "Vouni Panagias Natura 2000" },
    "CY-0067": { code: "CY4000013", layer: 1, name: "Kato Pafos Lighthouse Natura 2000" },
    "CY-0068": { code: "CY2000008", layer: 1, name: "Kremmoi Chanoutari Natura 2000" },
    "CY-0069": { code: "CY2000007", layer: 0, name: "Kremmoi Ezousas Natura 2000" },
    "CY-0070": { code: "CY4000019", layer: 1, name: "Koilada Sarama Natura 2000" },
    "CY-0071": { code: "CY4000020", layer: 1, name: "Koilada Diarizou Natura 2000" },
    "CY-0072": { code: "CY4000021", layer: 1, name: "Koilada Ezousas Natura 2000" },
    "CY-0073": { code: "CY5000011", layer: 1, name: "Koilada Limnati Natura 2000" },
    "CY-0074": { code: "CY5000008", layer: 1, name: "Koilada Xylourikou Natura 2000" },
    "CY-0075": { code: "CY5000009", layer: 1, name: "Potamos Paramaliou Natura 2000" },
    "CY-0076": { code: "CY6000008", layer: 1, name: "Potamos Pentaschinos Natura 2000" },
    "CY-0077": { code: "CY6000007", layer: 1, name: "Potamos Panagias Stazousas Natura 2000" },
    "CY-0078": { code: "CY4000018", layer: 1, name: "Ezousa River Estuary Natura 2000" },
    "CY-0079": { code: "CY4000018", layer: 1, name: "Xeropotamos and Diarizos Estuary Natura 2000" },
    "CY-0080": { code: "CY5000010", layer: 1, name: "Cha - Potami Area Natura 2000" },
    "CY-0081": { code: "CY6000009", layer: 1, name: "Kosii - Pallourokampou Area Natura 2000" },
    "CY-0082": { code: "CY2000014", layer: 1, name: "Atsas - Agios Theodoros Area Natura 2000" },
    "CY-0083": { code: "CY4000016", layer: 1, name: "Agias Aiakterinis - Agias Paraskevis Canyons Natura 2000" },
    "CY-0084": { code: "CY2000002", layer: 0, name: "Alykos Potamos Natura 2000" },
    "CY-0085": { code: "CY2000003", layer: 0, name: "Periochi Mitserou - Agrokipias Natura 2000" },
    "CY-0087": { code: "CY2000010", layer: 0, name: "Koilada Potamou Maroullenas Natura 2000" },
    "CY-0088": { code: "CY2000011", layer: 0, name: "Potamos Peristerona Natura 2000" },
    "CY-0089": { code: "CY2000012", layer: 0, name: "Kargoti Valley Natura 2000" },
    "CY-0090": { code: "CY3000009", layer: 1, name: "Agias Theklas - Liopetri Area Natura 2000" },
    "CY-0091": { code: "CY4000001", layer: 0, name: "Polis - Gialia Area Natura 2000" },
    "CY-0094": { code: "CY4000009", layer: 0, name: "Skoulli Area Natura 2000" },
    "CY-0095": { code: "CY4000015", layer: 1, name: "Kritou Marottou Area Natura 2000" },
    "CY-0096": { code: "CY5000007", layer: 0, name: "Asgata Area Natura 2000" },
    "CY-0097": { code: "CY6000003", layer: 1, name: "Periochi Lympion - Agias Annas Natura 2000" },
    "CY-0098": { code: "CY6000004", layer: 0, name: "Stavrovouni Forest Natura 2000" },
    "CY-0099": { code: "CY6000005", layer: 0, name: "Lefkara Area Natura 2000" },
    "CY-0037": { code: "CY6000002", layer: 1, name: "Larnaca Saltwater Lake Wetland Reserve" }
};

////////////////////
// LAYER GROUPS   //
////////////////////

// POTA pins (points)
const potaPinsLayer      = L.layerGroup();
// POTA boundaries (polygons + Natura 2000)
const potaBoundaryLayer  = L.layerGroup();
// SOTA summits
const sotaLayer          = L.layerGroup();
// McDonald's locations
const mcdLayer           = L.layerGroup();


////////////////////
// MAP INITIALISE //
////////////////////

const map = L.map('map', {
    maxBounds: cyprusBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 8,
    maxZoom: 17
}).setView([35.0, 33.0], 9);

L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles © Esri — Source: Esri, USGS, NOAA' }
).addTo(map);

// Make POTA layers visible by default
potaPinsLayer.addTo(map);
potaBoundaryLayer.addTo(map);

////////////////////
// ATNO CONTROL   //
////////////////////

let highlightATNO = false;

const ATNOControl = L.Control.extend({
    options: { position: 'topright' },

    onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');

        container.style.background   = 'white';
        container.style.padding      = '8px';
        container.style.borderRadius = '4px';
        container.style.boxShadow    = '0 0 6px rgba(0,0,0,0.3)';

        container.innerHTML = `
            <label style="font-size:14px; user-select:none;">
                <input type="checkbox" id="toggleATNOControl" />
                Highlight ATNOs
            </label>
        `;

        L.DomEvent.disableClickPropagation(container);

        const atnoBox = container.querySelector("#toggleATNOControl");
        atnoBox.addEventListener("change", (e) => {
            highlightATNO = e.target.checked;
            potaRefreshMarkers();
        });

        return container;
    }
});

map.addControl(new ATNOControl());

////////////////////////
// LAYER CONTROL MENU //
////////////////////////

const overlays = {
    "POTA Pins": potaPinsLayer,
    "POTA Boundaries": potaBoundaryLayer,
    "SOTA Summits": sotaLayer,
    "McDonald's": mcdLayer
};

L.control.layers(null, overlays).addTo(map);

////////////////////
// ICON HELPERS   //
////////////////////

function makeCircleMarker(color) {
    const svg = `
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="10"
                fill="${color}"
                stroke="#333"
                stroke-width="2" />
        </svg>
    `;
    return L.divIcon({
        html: svg,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
}

function makeMcdMarker() {
    const svg = `
<svg width="28" height="28" viewBox="0 0 28 28"
     xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="12"
            fill="#D00000"
            stroke="#333"
            stroke-width="1.5" />
    <path d="M8 17 Q12 4 14 17 Q16 4 20 17"
          stroke="#FFD700"
          stroke-width="2.4"
          fill="none"
          stroke-linecap="round" />
</svg>
    `;
    return L.divIcon({
        html: svg,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 28]
    });
}

////////////////////
// POTA FUNCTIONS //
////////////////////

let parks = [];

function potaChooseColor(park) {

    if (illegalParks.has(park.reference)) return "red";

    if (park.qsos === 0 && highlightATNO) return COLOR_ATNO;

    if (naturaMap[park.reference]) return COLOR_NATURA;

    if (park.name.includes("Archeological")) return COLOR_ARCHEOLOGICAL;
    if (park.name.includes("Scenic Trail"))  return COLOR_SCENIC_TRAIL;
    if (park.name.includes("National Forest")) return COLOR_NATIONAL_FOREST;
    if (park.name.includes("Forest Reserve")) return COLOR_NATIONAL_FOREST;

    return COLOR_DEFAULT;
}

function potaRestoreBoundary(layer, park) {
    if (!layer) return;

    const color = potaChooseColor(park);

    layer.setStyle({
        color,
        fillColor: color,
        weight: 2,
        fillOpacity: 0.25
    });
}

function potaHighlightBoundary(layer) {
    if (!layer) return;

    layer.setStyle({
        color: COLOR_HIGHLIGHT,
        weight: 4,
        fillOpacity: 0.1
    });
}

function potaLoadAllBoundaries() {

    for (const potaCode in potaPolygons) {

        const file = potaPolygons[potaCode];
        const park = parks.find(p => p.reference === potaCode);
        if (!park || !file) continue;

        const color = potaChooseColor(park);

        fetch(`./geojson/${file}`)
            .then(r => r.json())
            .then(data => {

                const poly = L.geoJSON(data, {
                    pane: "overlayPane",
                    style: {
                        color,
                        fillColor: color,
                        weight: 2,
                        fillOpacity: 0.25
                    }
                }).addTo(potaBoundaryLayer);

                park._polygonLayer = poly;
            })
            .catch(err => {
                console.error("Failed to load POTA boundary for", potaCode, file, err);
            });
    }
}

function potaRefreshMarkers() {

    potaPinsLayer.clearLayers();

    parks.forEach(park => {

        if (!park.latitude || !park.longitude) return;

        const color = potaChooseColor(park);
        const icon  = makeCircleMarker(color);

        const regionName = regionNames[park.locationDesc] || park.locationDesc || "Unknown";

        let line5;
        if (illegalParks.has(park.reference)) {
            line5 = "ILLEGAL to operate radio here";
        } else if (park.qsos === 0) {
            line5 = "ATNO";
        } else {
            line5 = `Activations : ${park.activations}`;
        }

        const popupHtml = `
            <div class="popup-content">
                <b>${park.reference}</b><br>
                ${park.name}<br>
                Maidenhead : ${park.grid}<br>
                Region : ${regionName}<br>
                ${line5}
            </div>
        `;

        const marker = L.marker([park.latitude, park.longitude], { icon })
            .addTo(potaPinsLayer)
            .bindPopup(popupHtml);

        marker.on("click", () => potaHandleClick(park));
    });
}

function potaHandleClick(park) {

    if (naturaMap[park.reference]) {
        highlightNatura2000Boundary(park.reference);
    } else {
        clearNatura2000Highlight();
    }

    if (park._polygonLayer) {
        potaHighlightBoundary(park._polygonLayer);
    }
}

////////////////////
// NATURA 2000    //
////////////////////

let highlightedBoundary = null;

function clearNatura2000Highlight() {
    if (highlightedBoundary) {
        map.removeLayer(highlightedBoundary);
        highlightedBoundary = null;
    }
}

function highlightNatura2000Boundary(potaCode) {
    const entry = naturaMap[potaCode];
    if (!entry || !entry.code || entry.layer === null) {
        console.warn("No Natura 2000 mapping for", potaCode);
        return;
    }

    const url =
        "https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer/" +
        entry.layer +
        "/query?where=sitecode='" +
        entry.code +
        "'&outFields=*&returnGeometry=true&f=geojson";

    fetch(url)
        .then(r => r.json())
        .then(data => {
            clearNatura2000Highlight();

            highlightedBoundary = L.geoJSON(data, {
                style: {
                    color: COLOR_HIGHLIGHT,
                    weight: 4,
                    fillOpacity: 0.1
                }
            }).addTo(map);
        })
        .catch(err => {
            console.error("Failed to highlight boundary for", potaCode, err);
        });
}

function loadAllNaturaBoundaries() {
    for (const potaCode in naturaMap) {
        const entry = naturaMap[potaCode];
        if (!entry || !entry.code || entry.layer === null) continue;

        const url =
            "https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer/" +
            entry.layer +
            "/query?where=sitecode='" +
            entry.code +
            "'&outFields=*&returnGeometry=true&f=geojson";

        fetch(url)
            .then(r => r.json())
            .then(data => {
                L.geoJSON(data, {
                    style: {
                        color: COLOR_NATURA,
                        weight: 2,
                        fillOpacity: 0.2
                    }
                }).addTo(potaBoundaryLayer);
            })
            .catch(err => {
                console.error("Failed to load boundary for", potaCode, entry.name, err);
            });
    }
}

////////////////////
// MCD FUNCTIONS  //
////////////////////

function mcdLoadMarkers() {
    mcdLocations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lon], { icon: makeMcdMarker() });

        const popupHtml = `
            <b>${loc.name}</b><br>
            ${loc.address}<br>
            <a href="https://www.google.com/maps?q=${loc.lat},${loc.lon}" target="_blank">
                Open in Google Maps
            </a>
        `;

        marker.bindPopup(popupHtml);
        mcdLayer.addLayer(marker);
    });
}

////////////////////
// SOTA FUNCTIONS //
////////////////////

function sotaLoadLayers() {

    console.log("SOTA: Starting load…");

    fetch("./geojson/sota.geojson")
        .then(response => {
            console.log("SOTA: Fetch response status =", response.status);
            return response.json();
        })
        .then(data => {
            console.log("SOTA: GeoJSON loaded successfully");
            console.log("SOTA: Number of features =", data.features.length);

            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {

                    console.log("SOTA: Adding summit:", feature.properties.summitCode);

                    return L.marker(latlng, {
                        pane: "markerPane",
                        icon: L.divIcon({
                                html: `
                                      <svg width="36" height="36" viewBox="0 0 24 24">
                                          <polygon points="12,3 3,21 21,21" fill="#555555"
                                           stroke="white"
                                           stroke-width="1"
                                          />
                                      </svg>
                                  `,
                            className: "",
                            iconSize: [36, 36],
                            iconAnchor: [18, 32]
                        })
                    });
                },

                onEachFeature: function (feature, layer) {
                    const p = feature.properties;

                    layer.bindPopup(`
                        <strong>${p.summitName}</strong><br>
                        Code: ${p.summitCode}<br>
                        Altitude: ${p.altM} m (${p.altFt} ft)<br>
                        Points: ${p.points}<br>
                        Bonus: ${p.bonusPoints}<br>
                        Activations: ${p.activationCount}
                    `);
                }
            }).addTo(sotaLayer);

            console.log("SOTA: Layer added to sotaLayer");
        })
        .catch(err => {
            console.error("SOTA: ERROR loading SOTA layer:", err);
        });
}

////////////////////
// FETCH POTA     //
////////////////////

fetch("https://api.pota.app/program/parks/CY")
    .then(response => response.json())
    .then(data => {
        parks = data;
        console.log("Parks loaded:", parks.length);

        potaRefreshMarkers();
        loadAllNaturaBoundaries();
        potaLoadAllBoundaries();
        mcdLoadMarkers();
        sotaLoadLayers();
    })
    .catch(err => console.error("Error loading CY parks:", err));

////////////////////
// LEGEND         //
////////////////////

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'pota-legend');

    div.innerHTML += '<h4>POTA Categories</h4>';
    div.innerHTML += '<small>Updated: 26-Aug-2026</small><br>';
    div.innerHTML += '<small>Category Set: V3.01</small><br><br>';

    div.innerHTML += '<i style="background: ' + COLOR_ATNO + '"></i> ATNO<br>';
    div.innerHTML += '<i style="background: ' + COLOR_NATURA + '"></i> Natura 2000<br>';
    div.innerHTML += '<i style="background: ' + COLOR_SCENIC_TRAIL + '"></i> Scenic Trail<br>';
    div.innerHTML += '<i style="background: ' + COLOR_NATIONAL_FOREST + '"></i> National Forest<br>';
    div.innerHTML += '<i style="background: ' + COLOR_ARCHEOLOGICAL + '"></i> Archeological Reserve<br>';
    div.innerHTML += '<i style="background: ' + COLOR_DEFAULT + '"></i> Other<br>';
    div.innerHTML += '<i style="background: red"></i> Illegal<br>';

    return div;
};

legend.addTo(map);

