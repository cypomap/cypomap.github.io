// created by Gary Morton with help from Microsoft CoPilot
//
// V3.00 - 24-Aug-2026



//////////////////
// CONST BLOCKS //
//////////////////

// --- 0. Map setup (uses Cyprus bounding box) ---
// --- 3. Marker colours ---
const COLOR_DEFAULT         = "#ffd700";   // yellow
const COLOR_ATNO            = "#0000aa";   // blue
const COLOR_NATURA          = "#99ff99";   // light green
const COLOR_SCENIC_TRAIL    = "#66ccff";   // light blue
const COLOR_NATIONAL_FOREST = "#228B22";   // dark green
const COLOR_ARCHEOLOGICAL   = "#888888";   // grey
const COLOR_HIGHLIGHT       = "#ff0066";   // dim highlight

const cyprusBounds = [
    [34.45, 32.15],
    [35.85, 34.65]
];

// --- 1. Region translation table ---
const regionNames = {
    "CY-PA": "Paphos",
    "CY-LA": "Larnaca",
    "CY-NI": "Nicosia",
    "CY-LE": "Limassol",
    "CY-FA": "Famagusta"
};

// --- 2. Illegal parks ---
const illegalParks = new Set([
    "CY-0153",
    "CY-0154",
    "CY-0161",
    "CY-0158",
    "CY-0164",
    "CY-0160",
    "CY-0159",
    "CY-0155",
    "CY-0156",
    "CY-0163",
    "CY-0148"
]);

const mcdLocations = [
    {
        name: "McDonald's Latsia (Nicosia)",
        address: "50, Archbishop Makarios III Avenue 2220, Latsia",
        lat: 35.111569, 
        lon: 33.382533
    },
    {
        name: "McDonald's Zenon",
        address: "Stratigou Timayia 6051 Larnaca",
        lat: 34.927703, 
        lon: 33.615922
    },
    {
        name: "McDonald's Livadia",
        address: "Pergamou 2, 7060 Livadia, Larnaca",
        lat: 34.949548, 
        lon: 33.646622 
    },
    {
        name: "McDonald's Finikoudes",
        address: "Athenon 30-32, 6023 Larnaca",
        lat: 34.913614, 
        lon: 33.637659
    },
    {
        name: "McDonald's Athalassa",
        address: "98 Athalassis Street Strovolos 2024",
        lat: 35.144670,
        lon: 33.361581
    },
    {
        name: "McDonald's Engomi",
        address: "Nikou Kranidioti 2 2411 Engomi, Nicosia",
        lat: 35.163540, 
        lon: 33.330472
    },
    {
        name: "McDonald's Lakatamia",
        address: "Agiou Georgiou Avenue 94, 2304 Lakatamia, Nicosia",
        lat: 35.112950, 
        lon: 33.291368
    },
    {
        name: "McDonald's Skarinou",
        address: "Plakota 12 7731 Skarinou",
        lat: 34.817677, 
        lon: 33.360728 
    },
    {
        name: "McDonald's Paralimni",
        address: "1st April 243, Paralimni 5280",
        lat: 35.025959,
        lon: 33.983183
    },
    {
        name: "McDonald's Limassol Germasogeia",
        address: "Georgiou Avenue 107, Germsogia, Limassol",
        lat: 34.700269,
        lon: 33.100592
    },
    {
        name: "McDonald's Makariou",
        address: "161 Archibishop Makarios III Avenue Limassol 4190",
        lat: 34.687482, 
        lon: 33.040479
    },
    {
        name: "McDonald's Ayia Napa",
        address: "Nissi Avenue 5 5330 Ayia Napa",
        lat: 34.986238, 
        lon: 33.998903
    },
    {
        name: "McDonald's Polemidia",
        address: "Katsantoneon 20 Street Kato Polemidia 4154 Limassol",
        lat: 34.688393,
        lon: 33.009183
    },
    {
        name: "McDonald's Protaras",
        address: "Protaras Avenue 5296 Paralimni",
        lat: 35.017875,
        lon: 34.047134
    },
    {
        name: "McDonald's Zakaki",
        address: "Franklin Roosevelt 281, 3046 Zakaki, Limassol",
        lat: 34.656527,
        lon: 32.997901
    },
    {
        name: "McDonald's Demokratias",
        address: "Demokratias Avenue 35, 8028 Paphos",
        lat: 34.776729,
        lon: 32.443837
    },
    {
        name: "McDonald's Paphos",
        address: "Tombs of the Kings Ave, Paphos",
        lat: 34.769936,
        lon: 32.410241
    },
];

const potaPolygons = {
    "CY-0008": "CY-0008-Machairas-National-Forest.geojson",
    "CY-0010": "CY-0010-Ayios-Nikandros-National-Forest.geojson",
    "CY-0128": "CY-0128-Ayios-Demetrios-Park.geojson",
    "CY-0131": "CY-0131-Metochi-Kykkou-Park.geojson",
    "CY-0132": "CY-0132-Poiiton-kai-Pnevmatikon-Park.geojson",
    "CY-0133": "CY-0133-Ioanni-Hadjipavlou-Park.geojson",
    "CY-0144": "CY-0144-Pyla-Beach-Park.geojson",
    "CY-0145": "CY-0145-Larnaka-Municipal-Garden-Park.geojson",
    "CY-0146": "CY-0146-Patyxeio-Park.geojson"
};

// --- 6. Create the map ---
const map = L.map('map', {
    maxBounds: cyprusBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 8,
    maxZoom: 15
}).setView([35.0, 33.0], 9);

// --- 7. Base map layer ---
L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles © Esri — Source: Esri, USGS, NOAA'
    }
).addTo(map);

// --- ATNO Toggle Control (Leaflet-style box) ---
const ATNOControl = L.Control.extend({
    options: { position: 'topright' },

    onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');

        container.style.background = 'white';
        container.style.padding = '8px';
        container.style.borderRadius = '4px';
        container.style.boxShadow = '0 0 6px rgba(0,0,0,0.3)';
        container.style.cursor = 'pointer';

        container.innerHTML = `
<label style="font-size:14px; user-select:none;">
    <input type="checkbox" id="toggleATNOControl" checked />
    Highlight ATNOs
</label>
<br>
<label style="font-size:14px; user-select:none;">
    <input type="checkbox" id="toggleMCDControl" checked />
    Show McDonald's
</label>
`;

        L.DomEvent.disableClickPropagation(container);

        const atnoBox = container.querySelector("#toggleATNOControl");
        const mcdBox = container.querySelector("#toggleMCDControl");

        console.log("ATNO checkbox:", atnoBox);
        console.log("MCD checkbox:", mcdBox);

        atnoBox.addEventListener("change", (e) => {
            highlightATNO = e.target.checked;
            refreshMarkers();
        });

        mcdBox.addEventListener("change", (e) => {
            if (e.target.checked) {
                mcdLayer.addTo(map);
            } else {
                map.removeLayer(mcdLayer);
            }
        });

        return container;
    }
});

map.addControl(new ATNOControl());

// --- 4. Natura 2000 mapping (keep your full corrected table here) ---
const naturaMap = {
    // POTA parks explicitly listed as Natura 2000
    "CY-0039": { code: "CY3000002", layer: 1, name: "Cape Gkreko SPA Natura 2000" },
    "CY-0060": { code: "CY4000010", layer: 0, name: "Akamas Peninsula Natura 2000" },
    "CY-0061": { code: "CY2000006", layer: 1, name: "Paphos forest Natura 2000" },
    "CY-0062": { code: "CY2000013", layer: 1, name: "Periohi Kionia Natura 2000" },
    "CY-0063": { code: "CY6000010", layer: 1, name: "Oroklini Lake Natura 2000" },
    "CY-0064": { code: "CY3000008", layer: 0, name: "Paralimni Lake Natura 2000" },
    "CY-0065": { code: "CY3000007", layer: 1, name: "Achna Dam Natura 2000" },
    "CY-0066": { code: "CY2000015", layer: 1, name: "Vouni Panagias Natura 2000" }, // TODO
    "CY-0067": { code: "CY4000013", layer: 1, name: "Kato Pafos Lighhouse Natura 2000" },
    "CY-0068": { code: "CY2000008", layer: 1, name: "Kremmoi Chanoutari (Chanoutari Cliffs) Natura 2000" }, // TODO
    "CY-0069": { code: "CY2000007", layer: 0, name: "Kremmoi Ezousas (Ezousa Cliffs) Natura 2000" }, // TODO
    "CY-0070": { code: "CY4000019", layer: 1, name: "Koilada Sarama (Sarama Valley) Natura 2000" },

    "CY-0071": { code: "CY4000020", layer: 1, name: "Koilada Diarizou (Diarizos Valley) Natura 2000" },
    "CY-0072": { code: "CY4000021", layer: 1, name: "Koilada Ezousas (Ezousa Valley) Natura 2000" },
    "CY-0073": { code: "CY5000011", layer: 1, name: "Koilada Limnati (Limnati Valley) Natura 2000" },
    "CY-0074": { code: "CY5000008", layer: 1, name: "Koilada Xylourikou (Xylourikou Valley) Natura 2000" },
    "CY-0075": { code: "CY5000009", layer: 1, name: "Potamos Paramaliou (Paramali River) Natura 2000" },
    "CY-0076": { code: "CY6000008", layer: 1, name: "Potamos Pentaschinos (Pentaschinos River) Natura 2000" },
    "CY-0077": { code: "CY6000007", layer: 1, name: "Potamos Panagias Stazousas (Panagia Stazousa River) Natura 2000" },
    "CY-0078": { code: "CY4000018", layer: 1, name: "Ezousa River Estuary Natura 2000" },
    "CY-0079": { code: "CY4000018", layer: 1, name: "Xeropotamos and Diarizos River Estuary Natura 2000" },
    "CY-0080": { code: "CY5000010", layer: 1, name: "Cha - Potami Area Natura 2000" },
    "CY-0081": { code: "CY6000009", layer: 1, name: "Kosii - Pallourokampou Area Natura 2000" },
    "CY-0082": { code: "CY2000014", layer: 1, name: "Atsas - Agios Theodoros Area Natura 2000" },
    "CY-0083": { code: "CY4000016", layer: 1, name: "Agias Aiakterinis - Agias Paraskevis Canyons Natura 2000" },
    "CY-0084": { code: "CY2000002", layer: 0, name: "Alykos Potamos (Agios Sozomenos) Natura 2000" },
    "CY-0085": { code: "CY2000003", layer: 0, name: "Periochi Mitserou - Agrokipias Natura 2000" },
    // "CY-0086": { code: "CY0000000", layer: 1, name: "Fountoukodasi Pitsilias Natura 2000" }, // unresolved
    "CY-0087": { code: "CY2000010", layer: 0, name: "Koilada Potamou Maroullenas Natura 2000" },
    "CY-0088": { code: "CY2000011", layer: 0, name: "Potamos Peristerona (Peristerona River) Natura 2000" },
    "CY-0089": { code: "CY2000012", layer: 0, name: "Kargoti Valley Natura 2000" },
    "CY-0090": { code: "CY3000009", layer: 1, name: "Agias Theklas - Liopetri Area Natura 2000" },
    "CY-0091": { code: "CY4000001", layer: 0, name: "Polis - Gialia Area Natura 2000" },
    // "CY-0092": { code: "CY0000000", layer: 1, name: "Episkopi Morou Nerou Natura 2000" }, // unresolved
    "CY-0094": { code: "CY4000009", layer: 0, name: "Skoulli Area Natura 2000" },
    "CY-0095": { code: "CY4000015", layer: 1, name: "Kritou Marottou Area Natura 2000" }, // TODO
    "CY-0096": { code: "CY5000007", layer: 0, name: "Asgata Area Natura 2000" },
    "CY-0097": { code: "CY6000003", layer: 1, name: "Periochi Lympion - Agias Annas Natura 2000" },
    "CY-0098": { code: "CY6000004", layer: 0, name: "Stavrovouni Forest Natura 2000" },
    "CY-0099": { code: "CY6000005", layer: 0, name: "Lefkara Area Natura 2000" },

    // Sites not tagged as Natura 2000 in POTA but whose boundaries map to Natura 2000
    //"CY-0002": { code: "CY5000004", layer: 1, name: "Troodos National Forest" },
    //"CY-0003": { code: "CY6000006", layer: 0, name: "Rizoelia National Forest" },
    //"CY-0012": { code: "CY3000001", layer: 1, name: "Potamos Liopetriou National Forest" }, // TODO
    "CY-0037": { code: "CY6000002", layer: 1, name: "Larnaca Saltwater Lake Wetland Reserve" } // Protected Planet
};

// --- 5. Global state ---
let highlightATNO       = true;                 // checkbox controls this
let highlightedBoundary = null;                 // current Natura highlight
let parks               = [];                   // POTA data
let currentPolygonLayer = null;


const markerLayer       = L.layerGroup().addTo(map);
const naturaLayer       = L.layerGroup().addTo(map);
const mcdLayer          = L.layerGroup().addTo(map);
const potaLayer         = L.layerGroup().addTo(map);


// McDonalds
// --- 7. Marker icon helper (keep your existing implementation if different) ---
function makeMcdMarker() {
    const svg = `
<svg width="28" height="28" viewBox="0 0 28 28"
     xmlns="http://www.w3.org/2000/svg">

    <!-- Red circle -->
    <circle cx="14" cy="14" r="12"
            fill="#D00000"
            stroke="#333"
            stroke-width="1.5" />

    <!-- Bigger, higher golden arches -->
    <path d="
        M8 17
        Q12 4 14 17
        Q16 4 20 17"
        stroke="#FFD700"
        stroke-width="2.4"
        fill="none"
        stroke-linecap="round"
    />
</svg>
    `;

    return L.divIcon({
        html: svg,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 28]
    });
}

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


// --- 8. Colour selection ---
function chooseMarkerColor(park) {
    // Illegal override (always red)
    if (illegalParks.has(park.reference)) {
        return "red";
    }

    // ATNO (qsos === 0) – either green or normal scheme
    if (park.qsos === 0) {
        if (highlightATNO) {
            return COLOR_ATNO;
        }
        // fall through to normal scheme if not highlighting
    }

    // Natura 2000 override if mapped
    if (naturaMap[park.reference] && naturaMap[park.reference].code) {
        return COLOR_NATURA;
    }

    // Name-based categories
    if (park.name.includes("Archeological Reserve")) {
        return COLOR_ARCHEOLOGICAL;
    }
    if (park.name.includes("Scenic Trail")) {
        return COLOR_SCENIC_TRAIL;
    }
    if (park.name.includes("National Forest")) {
        return COLOR_NATIONAL_FOREST;
    }

    // Default
    return COLOR_DEFAULT;
}


/////////////
// GEOJSON //
/////////////
function restoreGeoJsonBoundary(layer, park) {
    if (!layer || !park) return;

    const baseColor = chooseMarkerColor(park);

    layer.setStyle({
        color: baseColor,
        weight: 2,
        fillOpacity: 0.25,
        fill: true
    });
}

function highlightGeoJsonBoundary(layer, color = COLOR_HIGHLIGHT, weight = 4, fillOpacity = 0.1) {
    if (!layer) return;

    layer.setStyle({
        color: color,
        weight: weight,
        fillOpacity: fillOpacity,
        fill: true
    });
}

/////////////////
// NATURA 2000 //
/////////////////
// --- 9. Boundary highlight helpers ---
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
        "https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer/"
        + entry.layer
        + "/query?where=sitecode='"
        + entry.code
        + "'&outFields=*&returnGeometry=true&f=geojson";

    fetch(url)
        .then(r => r.json())
        .then(data => {
            clearNatura2000Highlight();

            highlightedBoundary = L.geoJSON(data, {
                style: {
                    color: COLOR_HIGHLIGHT,   // highlight
                    weight: 4,
                    fillOpacity: 0.1
                }
            }).addTo(map);
        })
        .catch(err => {
            console.error("Failed to highlight boundary for", potaCode, err);
        });
}

// --- 10. load all custom boundaries as background ---
// --- Load all POTA boundaries as background ---
function loadAllPotaBoundaries() {

    for (const potaCode in potaPolygons) {
        if (!Object.prototype.hasOwnProperty.call(potaPolygons, potaCode)) continue;

        const file = potaPolygons[potaCode];
        if (!file) continue;

        // --- Find the park object so we can compute its pin colour ---
        const park = parks.find(p => p.reference === potaCode);
        if (!park) {
            console.warn("No park found for", potaCode);
            continue;
        }

        // --- Compute the SAME colour used for the pin ---
        const markerColor = chooseMarkerColor(park);

        const url = `./geojson/${file}`;

        fetch(url)
            .then(r => r.json())
            .then(data => {

                L.geoJSON(data, {
                    pane: "overlayPane",
                    style: {
                        color: markerColor,      // outline matches pin
                        weight: 2,
                        fill: true,
                        fillColor: markerColor,  // fill matches pin
                        fillOpacity: 0.25        // same as Natura shading
                    }
                }).addTo(potaLayer);

                console.log("POTA polygon shaded for:", potaCode);
            })
            .catch(err => {
                console.error("Failed to load POTA boundary for", potaCode, file, err);
            });
    }
}


// --- 10. load all Natura boundaries as background ---
function loadAllNaturaBoundaries() {
    for (const potaCode in naturaMap) {
        if (!Object.prototype.hasOwnProperty.call(naturaMap, potaCode)) continue;

        const entry = naturaMap[potaCode];
        if (!entry || !entry.code || entry.layer === null) continue;

        const url =
            "https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer/"
            + entry.layer
            + "/query?where=sitecode='"
            + entry.code
            + "'&outFields=*&returnGeometry=true&f=geojson";

        fetch(url)
            .then(r => r.json())
            .then(data => {
                L.geoJSON(data, {
                    style: {
                        color: COLOR_NATURA,
                        weight: 2,
                        fillOpacity: 0.2
                    }
                }).addTo(naturaLayer);
            })
            .catch(err => {
                console.error("Failed to load boundary for", potaCode, entry.name, err);
            });
    }
}

// --- 11. Marker refresh (uses global `parks`) ---
function refreshMarkers() {

console.log("refreshMarkers running");
console.log("Looping parks:", parks.length);

    markerLayer.clearLayers();

    parks.forEach(park => {
        const lat = park.latitude;
        const lon = park.longitude;
        if (!lat || !lon) return;

        const regionName = regionNames[park.locationDesc] || park.locationDesc || "Unknown";

        const markerColor = chooseMarkerColor(park);
        const markerIcon  = makeCircleMarker(markerColor);

        const popupClass = park.name.includes("Natura 2000") ? "popup-natura" : "";

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

        const marker = L.marker([lat, lon], { icon: markerIcon })
            .addTo(markerLayer)
            .bindPopup(popupHtml, { className: popupClass });

            marker.on("click", () => {
            
                console.log("Clicked:", park.reference);
            
                // --- 1. Natura 2000 ---
                if (naturaMap[park.reference] && naturaMap[park.reference].code) {
                    console.log("Natura boundary exists for:", park.reference);
                    highlightNatura2000Boundary(park.reference);
                } else {
                    console.log("No Natura boundary for:", park.reference);
                    clearNatura2000Highlight();
                }
            
                // --- 2. Restore previous POTA highlight ---
                if (currentPolygonLayer && currentPolygonLayer !== park._polygonLayer) {
                    console.log("Restoring previous POTA highlight");
                    restoreGeoJsonBoundary(currentPolygonLayer, previousPark);
                }
            
                // --- 3. Highlight this POTA polygon (already loaded in loadAllPotaBoundaries) ---
                if (park._polygonLayer) {
                    console.log("Highlighting POTA polygon for:", park.reference);
                    highlightGeoJsonBoundary(park._polygonLayer);
            
                    currentPolygonLayer = park._polygonLayer;
                    previousPark = park;
                    return;   // No need to fetch — polygon already exists
                }
            
                // --- 4. If polygon not preloaded, fetch it (fallback) ---
                const file = potaPolygons[park.reference];
                console.log("GeoJSON file lookup:", file);
            
                if (!file) {
                    console.log("No GeoJSON file mapped for:", park.reference);
                    return;
                }
            
                const url = `./geojson/${file}`;
                console.log("Fetching:", url);
            
                fetch(url)
                    .then(res => {
                        console.log("Fetch response status:", res.status);
                        return res.json();
                    })
                    .then(data => {
                        console.log("GeoJSON loaded. Type:", data.features[0].geometry.type);
                        console.log("Number of features:", data.features.length);
            
                        const poly = L.geoJSON(data, {
                            pane: "overlayPane",
                            style: {
                                color: chooseMarkerColor(park),
                                weight: 2,
                                fill: true,
                                fillColor: chooseMarkerColor(park),
                                fillOpacity: 0.25
                            }
                        }).addTo(map);
            
                        park._polygonLayer = poly;
            
                        highlightGeoJsonBoundary(poly);
            
                        currentPolygonLayer = poly;
                        previousPark = park;
            
                        console.log("Polygon added to map.");
                    })
                    .catch(err => {
                        console.error("Polygon load error:", err);
                    });
            });




    });
}

mcdLocations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lon], {
        icon: makeMcdMarker()
    });

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

// --- Fetch McDonalds Data ---
//mcdLocations.forEach(loc => {
//    L.marker([loc.lat, loc.lon], { icon: makeMcdMarker() })
//        .addTo(mcdLayer)
//        .bindPopup(`<b>${loc.name}</b><br>${loc.address}`);
//});

// --- 12. Fetch POTA parks and initialise ---
fetch("https://api.pota.app/program/parks/CY")
    .then(response => response.json())
    .then(data => {
        parks = data;
console.log("Parks loaded:", parks.length);
        refreshMarkers();
        loadAllNaturaBoundaries();
        loadAllPotaBoundaries();
    })
    .catch(err => console.error("Error loading CY parks:", err));

// --- 13. Legend ---
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'pota-legend');

    div.innerHTML += '<h4>POTA Categories</h4>';
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

