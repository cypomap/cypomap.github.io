
// created by Gary Morton with help from Microsoft Copilot
// V3.00 - 26-Aug-2026
// V12.0 - 31-Aug-2026
// V13.0 - 01-Sep-2026
// V14.0 - 02-Sep-2026
// V15.0 - 03-Sep-2026
// V16.0 - 04-Sep-2026

//////////////////////
// CONSTANTS & DATA //
//////////////////////

const COLOUR_DEFAULT         = "#ffd700";
const COLOUR_ATNO            = "#0000aa";
const COLOUR_NATURA          = "#99ff99";
const COLOUR_SCENIC_TRAIL    = "#66ccff";
const COLOUR_NATIONAL_FOREST = "#228B22";
const COLOUR_ARCHEOLOGICAL   = "#888888";
const COLOUR_HIGHLIGHT       = "#ff0066";
const COLOUR_ACTIVATED       = "#FFFFFF";
const COLOUR_ILLEGAL         = "#ff0000";  
const COLOUR_CUSTOM_PINPOINT = "#f00f0f";  

// A central test coordinate inside Cyprus
const CYPRUS_TEST_LAT = 34.95;
const CYPRUS_TEST_LNG = 33.20;
// --- Cyprus bounding box (WGS84) ---
const CYPRUS_MIN_LAT = 34.45;
const CYPRUS_MAX_LAT = 35.85;
const CYPRUS_MIN_LNG = 32.15;
const CYPRUS_MAX_LNG = 34.65;

const cyprusBounds = [
    [CYPRUS_MIN_LAT - 0.05, CYPRUS_MIN_LNG - 0.05],
    [CYPRUS_MAX_LAT + 0.05, CYPRUS_MAX_LNG + 0.05]
];

const GPS_ZOOM_LEVEL = 14;

// Base map URLs
const esriImageryURL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const esriStreetURL  = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
const osmURL         = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const openTopoURL    = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";

const esriImagery = L.tileLayer(esriImageryURL, { maxZoom: 19, attribution: "Tiles © Esri | Source: Esri, USGS, NOAA" });
const esriStreet  = L.tileLayer(esriStreetURL,  { maxZoom: 19, attribution: "Tiles © Esri | Source: Esri, USGS, NOAA" });
const osm         = L.tileLayer(osmURL,         { maxZoom: 19, attribution: "© OpenStreetMap contributors" });
const openTopo    = L.tileLayer(openTopoURL,    { maxZoom: 17, attribution: "© OpenTopoMap (CC-BY-SA)" });

const baseLayers = [
    esriStreet,
    osm,
    openTopo,
    esriImagery
];


const regionNames = {
    "CY-PA": "Paphos",
    "CY-LA": "Larnaca",
    "CY-NI": "Nicosia",
    "CY-LE": "Limassol",
    "CY-FA": "Famagusta",
    "CY-KY": "North Cyprus"
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
    "CY-0001": "CY-0001-Troodos-UNESCO-Geopark.geojson",
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
    "CY-0038": "CY-0038-Lara-Toxeftra-Turtle-Reserve-Marine-Protected-Area.geojson",
    "CY-0040": "CY-0040-Nisia-Marine-area-Marine-Protected-Area.geojson",
    "CY-0048": "CY-0048-Orites-forest-Protected-Area.geojson",
    "CY-0049": "CY-0049-Ranti-forest-Protected-Area.geojson",
    "CY-0050": "CY-0050-Kyparissia-Protected-Area.geojson",
    "CY-0051": "CY-0051-Makronisos-Protected-Area.geojson",
    "CY-0052": "CY-0052-Periohi-Kopri-Protected-Area.geojson",
    "CY-0054": "CY-0054-Geomorfomata-Kathika-Protected-Landscape.geojson",
    "CY-0055": "CY-0055-Vrahoi-Inias-Protected-Landscape.geojson",
    "CY-0056": "CY-0056-Androlikou-Kranasi-and-Ambelakia-gorge-Protected-Landscape.geojson",
    "CY-0057": "CY-0057-Avakas-gorge-Protected-Landscape.geojson",
    "CY-0058": "CY-0058-Lythrodontas2-Dam-Protected-Landscape.geojson",
    "CY-0059": "CY-0059-Xyliatos-Dam-Protected-Landscape.geojson",
    "CY-0102": "CY-0102-Akamas-Botanical-Garden-Ecological-Site.geojson",
    "CY-0109": "CY-0109-Kition-Archeological-Reserve.geojson",
    "CY-0119": "CY-0119-Friendship-of-the-Nations-Park.geojson",
    "CY-0120": "CY-0120-Garyllis-Linear-Park.geojson",
    "CY-0121": "CY-0121-Limassol-Municipal-Garden-Park.geojson",
    "CY-0122": "CY-0122-CYTA-Park.geojson",
    "CY-0125": "CY-0125-Limassol-Molos-Park.geojson",
    "CY-0123": "CY-0123-Melina-Mercury-Park.geojson",
    "CY-0124": "CY-0124-Pano-Polemidia-Park.geojson",
    "CY-0126": "CY-0126-Atlandidos-Park.geojson",
    "CY-0128": "CY-0128-Ayios-Demetrios-Park.geojson",
    "CY-0131": "CY-0131-Metochi-Kykkou-Park.geojson",
    "CY-0132": "CY-0132-Poiiton-kai-Pnevmatikon-Park.geojson",
    "CY-0133": "CY-0133-Ioanni-Hadjipavlou-Park.geojson",
    "CY-0138": "CY-0138-Anthoupolis-Park.geojson",
    "CY-0143": "CY-0143-Nicosia-Municipal-Garden-Park.geojson",
    "CY-0144": "CY-0144-Pyla-Beach-Park.geojson",
    "CY-0145": "CY-0145-Larnaka-Municipal-Garden-Park.geojson",
    "CY-0146": "CY-0146-Patyxeio-Park.geojson",
    "CY-0149": "CY-0149-Michalaki-Kousoulidi-Community-Park.geojson",
    "CY-0150": "CY-0150-Deftera-Community-Park.geojson",
    "CY-0151": "CY-0151-Andreas-Christou-Community-Park.geojson",
    "CY-0165": "CY-0165-Pikni-Forest-Reserve.geojson",
    "CY-0169": "CY-0169-Sotira-Forest-National-Park.geojson"
};


////////////
// TRAILS //
////////////

const potaTrails = {
    "CY-0014": "CY-0014-Persephone-Trail.geojson",
    "CY-0015": "CY-0015-Kalidonia-Waterfalls-Trail.geojson",
    "CY-0016": "CY-0016-Prodromos-Dam-Stavroulia-Trail.geojson",
    "CY-0017": "CY-0017-Teisia-tis-Madaris-Trail.geojson",
    "CY-0018": "CY-0018-Millomeris-Waterfalls-Trail.geojson",
    "CY-0019": "CY-0019-Artemis-Trail.geojson",
    "CY-0020": "CY-0020-Kannoures-Agios-Nikolaos-Trail.geojson",
    "CY-0021": "CY-0021-Doxa-Soi-o-Theos-Madari-fire-lookout-Trail.geojson",
    "CY-0022": "CY-0022-Enetika-Gefyria-Bridges-Trail.geojson",
    "CY-0023": "CY-0023-Atalanti-Trail.geojson",
    "CY-0024": "CY-0024-Agia-Eirini-Trail.geojson",
    "CY-0025": "CY-0025-Panagia-tou-Araka-Trail.geojson",
    "CY-0026": "CY-0026-Psilo-Dendro-Pouziaris-Trail.geojson",
    "CY-0027": "CY-0027-Prodromos-Zoumi-Trail.geojson",
    "CY-0028": "CY-0028-Mnimata-ton-Piskopon-Trail.geojson",
    "CY-0029": "CY-0029-Loumata-ton-Aeton-Trail.geojson",
    "CY-0030": "CY-0030-Livadi-Trail.geojson",
    "CY-0031": "CY-0031-Kionia-Profitis-Ilias-Trail.geojson",
    "CY-0032": "CY-0032-Xyliatos-Trail.geojson",
    "CY-0033": "CY-0033-Selladi-tou-Karamanli-Kannavia-Trail.geojson",
    "CY-0034": "CY-0034-Madari-Selladi-tou-Karamanli-Trail.geojson",
    "CY-0035": "CY-0035-Chrysovrysi-Trail.geojson"
};

/////////////////
// NATURA 2000 //
/////////////////
const naturaMap = {
    "CY-0039": { code: "CY3000002", layer: 1, name: "Cape Gkreko SPA Natura 2000" },
    "CY-0060": { code: "CY4000010", layer: 0, name: "Akamas Peninsula Natura 2000" },
    "CY-0061": { code: "CY2000006", layer: 1, name: "Paphos Forest Natura 2000" },
    "CY-0062": { code: "CY2000013", layer: 1, name: "Periohi Kionia Natura 2000" },
    "CY-0063": { code: "CY6000010", layer: 1, name: "Oroklini Lake Natura 2000" },
    "CY-0064": { code: "CY3000008", layer: 0, name: "Paralimni Lake Natura 2000" },
    "CY-0065": { code: "CY3000007", layer: 1, name: "Achna Dam Natura 2000" },
    "CY-0066": { code: "CY4000004", layer: 1, name: "Vouni Panagias Natura 2000" },
    "CY-0067": { code: "CY4000013", layer: 1, name: "Kato Pafos Lighthouse Natura 2000" },
    "CY-0068": { code: "CY4000017", layer: 1, name: "Kremmoi Chanoutari (Chanoutari Cliffs) Natura 2000" },
    "CY-0069": { code: "CY4000022", layer: 1, name: "Kremmoi Ezousas Natura 2000" },
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
    "CY-0086": { code: "CY2000009", layer: 0, name: "Fountoukodasi Pitsilias Natura 2000" },
    "CY-0087": { code: "CY2000010", layer: 0, name: "Koilada Potamou Maroullenas Natura 2000" },
    "CY-0088": { code: "CY2000011", layer: 0, name: "Potamos Peristerona Natura 2000" },
    "CY-0089": { code: "CY2000012", layer: 0, name: "Kargoti Valley Natura 2000" },
    "CY-0090": { code: "CY3000009", layer: 1, name: "Agias Theklas - Liopetri Area Natura 2000" },
    "CY-0091": { code: "CY4000001", layer: 0, name: "Polis - Gialia Area Natura 2000" },
    "CY-0092": { code: "CY4000005", layer: 0, name: "Episkopi Morou Nerou Natura 2000" },
    "CY-0094": { code: "CY4000009", layer: 0, name: "Skoulli Area Natura 2000" },
    "CY-0095": { code: "CY4000015", layer: 0, name: "Kritou Marottou Area Natura 2000" },
    "CY-0096": { code: "CY5000007", layer: 0, name: "Asgata Area Natura 2000" },
    "CY-0097": { code: "CY6000003", layer: 0, name: "Periochi Lympion - Agias Annas Natura 2000" },
    "CY-0098": { code: "CY6000004", layer: 0, name: "Stavrovouni Forest Natura 2000" },
    "CY-0099": { code: "CY6000005", layer: 0, name: "Lefkara Area Natura 2000" },
    "CY-0037": { code: "CY6000002", layer: 1, name: "Larnaca Saltwater Lake Wetland Reserve" }
};

///////////
// ICONS //
///////////

const parkingIcon = L.icon({
    iconUrl: 'images/custom-parking.jpg',
    iconSize: [28, 28],   // tweak as needed
    iconAnchor: [14, 28], // bottom centre
    popupAnchor: [0, -28]
});
const cancelIcon = L.icon({
    iconUrl: 'images/custom-cancel.jpg',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});
const removeIcon = L.icon({
    iconUrl: 'images/custom-remove.jpg',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});
const foodIcon = L.icon({
    iconUrl: 'images/custom-food.jpg',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});
const gotoMapsIcon = L.icon({
    iconUrl: 'images/goto-google-maps.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});

const iconMap = {
    parking: parkingIcon,
    food: foodIcon
    // add more types here later
};

////////////////////
// LAYER GROUPS   //
////////////////////

const potaPinsLayer           = L.layerGroup(); // POTA boundaries (polygons + Natura 2000)
const potaBoundaryLayer       = L.layerGroup();
const potaTrailLayer          = L.layerGroup();
const sotaLayer               = L.layerGroup(); // SOTA summits
const sotaActivationZoneLayer = L.layerGroup();
const mcdLayer                = L.layerGroup(); // McDonald's locations
const picnicSitesLayer        = L.layerGroup(); // Offical piicnic sites
const customPinsLayer         = L.layerGroup(); // my pin points


////////////////////
// MAP INITIALISE //
////////////////////

const map = L.map('map', {
    maxBounds: cyprusBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 8,
    maxZoom: 17
}).setView([35.0, 33.0], 9);

//L.tileLayer(
//    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
//    { attribution: 'Tiles © Esri | Source: Esri, USGS, NOAA' }
//).addTo(map);

let currentBase = 0;
baseLayers[currentBase].addTo(map);

// Make POTA layers visible by default
potaPinsLayer.addTo(map);

////////////////////
// HIGHLIGHT MODE //
////////////////////

// "exclusive" = only one highlight at a time
// "additive"  = multiple highlights stay visible
let highlightMode = "exclusive";

// All highlight polygons go here
const highlightLayerGroup = L.layerGroup().addTo(map);


/////////////////////////////////
// BOOLEAN HIGHLIGHT OPTIONS   //
/////////////////////////////////

let popupOpen          = false;
let popupJustClosed    = false;
let showActivated      = false;
let showUnactivated    = false;
let highlightActivated = false;
let highlightATNO      = false;

const PotaFilterControl = L.Control.extend({
    options: { position: 'topright' },

    onAdd: function () {

        // Create the container
        const container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');

        container.style.background   = 'white';
        container.style.padding      = '10px';
        container.style.borderRadius = '4px';
        container.style.boxShadow    = '0 0 6px rgba(0,0,0,0.3)';
        container.style.marginTop    = '6px';
        //container.style.lineHeight   = '1.3';

        // Insert ALL HTML (checkboxes + buttons)
        container.innerHTML = `
        <!-- Entire Options Menu (collapsible) -->
        <div id="options-menu" class="collapsed">
        
            <!-- Header with triangle + Cyprus icon -->
            <div id="options-header">
                <span id="options-triangle">&#9660;</span> <!-- down triangle -->
                Options Menu
            </div>
        
            <!-- Everything collapses -->
            <div id="options-content">
        
                <!-- Highlight Options -->
                <div class="section-title">Highlight Options</div>
        
                <label><input type="checkbox" id="toggleHighlightATNO"> Highlight ATNOs</label><br>
                <label><input type="checkbox" id="toggleHighlightActivated"> Highlight Activated</label><br>
                <label><input type="checkbox" id="toggleShowActivated"> Show Activated by me</label><br>
                <label><input type="checkbox" id="toggleShowUnactivated"> Show Unactivated by me</label>
        
                <!-- Modes -->
                <div class="section-title">Modes</div>
                <label><input type="checkbox" id="toggleAdditiveHighlight"> Additive Highlight</label>
        
                <!-- Import / Export -->
                <div class="section-title">Import / Export</div>
        
                <button id="exportActivations" class="big-button">Export Activations</button><br>
                <button id="importActivations" class="big-button">Import Activations</button>
        
            </div>
        </div>
        `;

        // Prevent map drag when clicking inside the box
        L.DomEvent.disableClickPropagation(container);

        // Get references to all elements
        const boxATNO            = container.querySelector("#toggleHighlightATNO");
        const boxActivatedCol    = container.querySelector("#toggleHighlightActivated");
        const boxShowActivated   = container.querySelector("#toggleShowActivated");
        const boxShowUnactivated = container.querySelector("#toggleShowUnactivated");
        const boxAdditive        = container.querySelector("#toggleAdditiveHighlight");

        const exportBtn          = container.querySelector("#exportActivations");
        const importBtn          = container.querySelector("#importActivations");

        // --- Checkbox logic ---

        boxATNO.addEventListener("change", () => {
            highlightATNO = boxATNO.checked;
            console.log("Highlight ATNOs:", highlightATNO);
            potaRefreshMarkers();
        });

        boxActivatedCol.addEventListener("change", () => {
            highlightActivated = boxActivatedCol.checked;
            console.log("Highlight Activated:", highlightActivated);
            potaRefreshMarkers();
        });

        // Mutually exclusive filters
        boxShowActivated.addEventListener("change", () => {
            if (boxShowActivated.checked) {
                boxShowUnactivated.checked = false;
                showActivated = true;
                showUnactivated = false;
            } else {
                showActivated = false;
            }
            console.log("Show Activated:", showActivated);
            potaRefreshMarkers();
        });

        boxShowUnactivated.addEventListener("change", () => {
            if (boxShowUnactivated.checked) {
                boxShowActivated.checked = false;
                showUnactivated = true;
                showActivated = false;
            } else {
                showUnactivated = false;
            }
            console.log("Show Unactivated:", showUnactivated);
            potaRefreshMarkers();
        });

        // Additive highlight mode
        boxAdditive.addEventListener("change", () => {
            //additiveHighlight = boxAdditive.checked;
            //console.log("Additive Highlight:", additiveHighlight);
            highlightMode = boxAdditive.checked ? "additive" : "exclusive";
            console.log("Highlight mode:", highlightMode);
            potaRefreshMarkers();
        });

        // --- Export logic ---
        exportBtn.addEventListener("click", () => {
            const activations = JSON.parse(localStorage.getItem("activations") || "[]");
            const customPins = JSON.parse(localStorage.getItem("customPins") || "[]");
        
            const data = {
                activations: activations,
                customPins: customPins
            };
        
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json"
            });
        
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
        
            a.href = url;
            a.download = "cypomap-data.json";
            a.click();
        
            URL.revokeObjectURL(url);
        
            console.log("Exported activations:", activations.length);
            console.log("Exported custom pins:", customPins.length);
        });

        // --- Import logic ---
        importBtn.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/json";
        
            input.onchange = () => {
                const file = input.files[0];
                const reader = new FileReader();
        
                reader.onload = () => {
                    try {
                        const imported = JSON.parse(reader.result);
        
                        // Expect unified format
                        localStorage.setItem("activations", JSON.stringify(imported.activations || []));
                        localStorage.setItem("customPins", JSON.stringify(imported.customPins || []));
        
                        console.log("Imported activations:", (imported.activations || []).length);
                        console.log("Imported custom pins:", (imported.customPins || []).length);
        
                        // Refresh POTA/SOTA/LLOTA markers
                        potaRefreshMarkers();
        
                        // Refresh custom pins
                        customPinsLayer.clearLayers();
                        (imported.customPins || []).forEach(addCustomPinToMap);
        
                        alert("Import complete.");
                    } catch (err) {
                        console.error("Import failed:", err);
                        alert("Import failed: invalid JSON.");
                    }
                };
        
                reader.readAsText(file);
            };
        
            input.click();
        });


        return container;
    }
});

map.addControl(new PotaFilterControl());

// Collapse/expand entire Options Menu
document.addEventListener("DOMContentLoaded", () => {
    const header   = document.getElementById("options-header");
    const menu     = document.getElementById("options-menu");
    const triangle = document.getElementById("options-triangle");

    if (header && menu && triangle) {
        header.addEventListener("click", () => {
            const collapsed = menu.classList.toggle("collapsed");
            triangle.innerHTML = collapsed ? "&#9660;" : "&#9650;"; // down / up
        });
    }
});

////////////////////////
// LAYER CONTROL MENU //
////////////////////////

const overlays = {
    "POTA Pins": potaPinsLayer,
    "POTA Boundaries": potaBoundaryLayer,
    "POTA Trails": potaTrailLayer,
    "SOTA Summits": sotaLayer,
    "SOTA Activation Zone": sotaActivationZoneLayer,
    "Picnic Sites": picnicSitesLayer,
    "McDonald's(tm)": mcdLayer,
    "Custom Pins's": customPinsLayer
};

L.control.layers(null, overlays).addTo(map);

////////////////////
// ICON HELPERS   //
////////////////////

function makePicnicMarker() {
    const svg = `
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24" fill="none"
             stroke="#8B4513" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

            <!-- Table top -->
            <path d="M3 10h18" />

            <!-- Left leg -->
            <path d="M7 10l-4 8" />

            <!-- Right leg -->
            <path d="M17 10l4 8" />

        </svg>
    `;

    return L.divIcon({
        html: svg,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
}

function makeCircleMarker(colour) {
    const svg = `
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="10"
                fill="${colour}"
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


function markActivated(ref) {
    let list = JSON.parse(localStorage.getItem("activations") || "[]");

    // Check if already present
    if (!list.some(a => a.ref === ref)) {
        list.push({ ref: ref, type: "POTA" });  // default type for now
        localStorage.setItem("activations", JSON.stringify(list));
    }

    potaRefreshMarkers();
}

function deleteActivated(ref) {
    let list = JSON.parse(localStorage.getItem("activations") || "[]");

    list = list.filter(a => a.ref !== ref);

    localStorage.setItem("activations", JSON.stringify(list));

    potaRefreshMarkers();
}

////////////////////
// POTA FUNCTIONS //
////////////////////

let parks = [];

function potaChooseColour(park) {

    if (illegalParks.has(park.reference)) return COLOUR_ILLEGAL;

    const activatedList = JSON.parse(localStorage.getItem("activations") || "[]");
    if (highlightActivated && activatedList.some(a => a.ref === park.reference)) {
        return COLOUR_ACTIVATED;
    }

    if (park.qsos === 0 && highlightATNO) return COLOUR_ATNO;

    if (naturaMap[park.reference]) return COLOUR_NATURA;

    if (park.name.includes("Archeological"))   return COLOUR_ARCHEOLOGICAL;
    if (park.name.includes("Scenic Trail"))    return COLOUR_SCENIC_TRAIL;
    if (park.name.includes("National Forest")) return COLOUR_NATIONAL_FOREST;
    if (park.name.includes("Forest Reserve"))  return COLOUR_NATIONAL_FOREST;

    return COLOUR_DEFAULT;
}

function potaRestoreBoundary(layer, park) {
    if (!layer) return;

    const colour = potaChooseColour(park);

    layer.setStyle({
        color: colour,
        fillColor: colour,
        weight: 2,
        fillOpacity: 0.25
    });
}

function potaHighlightBoundary(layer) {
    if (!layer) return;

    layer.setStyle({
        color: COLOUR_HIGHLIGHT,
        weight: 4,
        fillOpacity: 0.1
    });
}

/////////////////////////
// UNIVERSAL HIGHLIGHT //
/////////////////////////

function addHighlight(geoLayer) {

    if (highlightMode === "exclusive") {
        highlightLayerGroup.clearLayers();
    }

    highlightLayerGroup.addLayer(geoLayer);
}

////////////////
// TRAIL ZOOM //
////////////////
map.on("zoomend", () => {
    const z = map.getZoom();

    const w = z >= 17 ? 18 :
              z >= 16 ? 14 :
              z >= 15 ? 10 :
              z >= 14 ? 7  :
              z >= 13 ? 5  :
              z >= 12 ? 3  :
              2;   // zoom 8–11

    const o = z >= 17 ? 0.9 :
              z >= 16 ? 0.85 :
              z >= 15 ? 0.8 :
              z >= 14 ? 0.75 :
              z >= 13 ? 0.7 :
              z >= 12 ? 0.6 :
              0.5;  // zoom 8–11

    potaTrailLayer.eachLayer(layer => {
        layer.setStyle({
            weight: w,
            opacity: o
        });
    });
});



////////////
// TRAILS //
////////////
let activeTrail = null;   // currently highlighted trail

function highlightTrail(park) {

    console.log("Highlighting trail for", park.reference);

    // Remove highlight from previous trail
    if (activeTrail && activeTrail._trailLayer) {
        activeTrail._trailLayer.setStyle({
            color: COLOUR_SCENIC_TRAIL,   // pale blue
            weight: 4,
            opacity: 0.9
        });
    }

    // Apply highlight to new trail
    if (park && park._trailLayer) {
        park._trailLayer.setStyle({
            color: "#0047b3",   // dark blue highlight
            weight: 6,
            opacity: 1.0
        });
        activeTrail = park;
    }
}

function loadAllPotaTrails() {

    console.log("POTA: Trail loader started");

    for (const potaCode in potaTrails) {

        const file = potaTrails[potaCode];

        const park = parks.find(p => p.reference === potaCode);

        if (!park || !file) {
            console.warn("POTA: Skipping", potaCode, "(no park or no file)");
            continue;
        }

        const colour = COLOUR_SCENIC_TRAIL;
        const url = `./geojson/POTA/${file}`;

        console.log("POTA: Fetching trail", potaCode, "from", url);

        fetch(url)
            .then(r => {
                if (!r.ok) {
                    console.error("POTA: ERROR loading", potaCode, file, "HTTP", r.status);
                    return null;
                }
                return r.json();
            })
            .then(data => {
                if (!data) return;

                console.log("POTA: Adding trail", potaCode);

                const trail = L.geoJSON(data, {
                    pane: "overlayPane",
                    style: {
                        color: colour,   // pale blue
                        weight: 4,
                        opacity: 0.9
                    }
                }).addTo(potaTrailLayer);

                // Store reference
                park._trailLayer = trail;

                // Add click handler to trail pin (if it exists)
                if (park._marker) {
                    console.log("Trail loader: marker exists for", park.reference);
                
                    park._marker.on('click', () => {
                        console.log("Trail loader: CLICK detected for", park.reference);
                        highlightTrail(park);
                    });
                } else {
                    console.warn("Trail loader: NO marker yet for", park.reference);
                }
                


            })
            .catch(err => {
                console.error("POTA: Fetch failed for", potaCode, file, err);
            });
    }
}

/////////////////////
// POTA BOUNDARIES //
/////////////////////

function loadAllPotaBoundaries() {

    for (const potaCode in potaPolygons) {

        const file = potaPolygons[potaCode];
        const park = parks.find(p => p.reference === potaCode);
        if (!park || !file) continue;

        const colour = potaChooseColour(park);

        fetch(`./geojson/POTA/${file}`)
            .then(r => r.json())
            .then(data => {

                const poly = L.geoJSON(data, {
                    pane: "overlayPane",
                    style: {
                        color: colour,
                        fillColor: colour,
                        weight: 2,
                        fillOpacity: (colour === COLOUR_DEFAULT ? 0.50 : 0.25)
                    }
                }).addTo(potaBoundaryLayer);

                park._polygonLayer = poly;
            })
            .catch(err => {
                console.error("Failed to load POTA boundary for", potaCode, file, err);
            });
    }
}

//////////////////
// POTA REFRESH //
//////////////////

function potaRefreshMarkers() {

    potaPinsLayer.clearLayers();

    const activatedList = JSON.parse(localStorage.getItem("activations") || "[]");

    parks.forEach(park => {

        const lat = park.latitude;
        const lon = park.longitude;

        if (!lat || !lon) return;

        const isActivated = activatedList.some(a => a.ref === park.reference);
        const isIllegal   = illegalParks.has(park.reference);

        // --- NEW FILTERING LOGIC ---
        if (showActivated && !isActivated) return;     // only show activated
        if (showUnactivated && isActivated) return;    // only show unactivated
        // --------------------------------

        const colour = potaChooseColour(park);
        const icon  = makeCircleMarker(colour);

        const regionName = regionNames[park.locationDesc] || park.locationDesc || "Unknown";

        let line5;
        if (isIllegal) {
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
                ${line5}<br><br>
        
                ${
                    isIllegal
                    ? ""   // illegal ? no activation or google buttons
                    : `
                        <div style="display:flex; gap:10px; align-items:center;">
                            ${
                                isActivated
                                ? `<button onclick="deleteActivated('${park.reference}')">Remove Activation</button>`
                                : `<button onclick="markActivated('${park.reference}')">Mark as Activated</button>`
                            }
        
                            <button onclick="window.open('https://www.google.com/maps?q=${lat},${lon}', '_blank')">
                                goto Google Maps
                            </button>
                        </div>
                    `
                }
        
            </div>
        `;

        const marker = L.marker([lat, lon], { icon })
            .addTo(potaPinsLayer)
            .bindPopup(popupHtml);

        park._marker = marker;   // <-- THIS is the missing link
        park._marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);   // prevent map click
            potaHandleClick(park);           // your existing logic
            highlightTrail(park);            // highlight if trail exists
        });
        

        marker.on("click", () => potaHandleClick(park));
    });
}


function potaHandleClick(park) {

    // Natura 2000 highlight (exclusive)
    if (naturaMap[park.reference]) {
        clearNatura2000Highlight();
        highlightNatura2000Boundary(park.reference);
    } else {
        clearNatura2000Highlight();
    }

    // POTA boundary highlight (exclusive/additive)
    if (park._polygonLayer) {
        const clone = L.geoJSON(park._polygonLayer.toGeoJSON(), {
            style: {
                color: COLOUR_HIGHLIGHT,
                weight: 4,
                fillOpacity: 0.1
            }
        });
        addHighlight(clone);
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

                const layer = L.geoJSON(data, {
                    style: {
                        color: COLOUR_HIGHLIGHT,
                        weight: 4,
                        fillOpacity: 0.1
                    }
                });
    
                addHighlight(layer);
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
                        color: COLOUR_NATURA,
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

/////////////////////////////
// PICNIC SITES FUNCTIONS  //
/////////////////////////////

async function picnicSitesLoadMarkers() {

    const url = "./geojson/picnic-sites.geojson";

    try {
        const response = await fetch(url);
        const data = await response.json();

        data.features.forEach(feature => {

            const props = feature.properties;
            const geom  = feature.geometry;

            const lat = geom.coordinates[1];
            const lon = geom.coordinates[0];

            const popup = `
                <div class="popup">
                    <h3>${props.picnicName}</h3>
                    <div><strong>Altitude:</strong> ${props.altitude} m</div>
                    <div><strong>Capacity:</strong> ${props.capacity}</div>
                    <div>
                        <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank">
                            goto Google Maps
                        </a>
                    </div>
                </div>
            `;

            const marker = L.marker([lat, lon], {
                icon: makePicnicMarker()
            }).bindPopup(popup);

            picnicSitesLayer.addLayer(marker);
        });

    } catch (err) {
        console.error("Failed to load picnic sites:", err);
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
                goto Google Maps
            </a>
        `;

        marker.bindPopup(popupHtml);
        mcdLayer.addLayer(marker);
    });
}

////////////////////
// SOTA FUNCTIONS //
////////////////////

function sotaZoneLoadLayers() {

    console.log("SOTA Zones: Starting load…");

    fetch("./geojson/SOTA/sota.geojson")
        .then(response => {
            console.log("SOTA Zones: Fetch response =", response.status);
            return response.json();
        })
        .then(data => {

            console.log("SOTA Zones: Summit file loaded, features =", data.features.length);

            data.features.forEach(feature => {

                const zoneFile = feature.properties.activationZone;

                if (!zoneFile) {
                    console.log(`SOTA Zones: Summit ${feature.properties.summitCode} has no activation zone.`);
                    return;
                }

                console.log(`SOTA Zones: Loading zone for ${feature.properties.summitCode} ? ${zoneFile}`);

                fetch(`./geojson/SOTA/${zoneFile}`)
                    .then(r => r.json())
                    .then(zoneGeo => {

                        const zoneLayer = L.geoJSON(zoneGeo, {
                            style: {
                                color: COLOUR_ILLEGAL,
                                weight: 2,
                                fillOpacity: 0.15
                            }
                        });

                        sotaActivationZoneLayer.addLayer(zoneLayer);

                        console.log(`SOTA Zones: Added zone for ${feature.properties.summitCode}`);
                    })
                    .catch(err => {
                        console.error(`SOTA Zones: ERROR loading ${zoneFile}`, err);
                    });

            });

        })
        .catch(err => {
            console.error("SOTA Zones: ERROR loading sota.geojson", err);
        });
}

function sotaLoadLayers() {

    console.log("SOTA: Starting load…");

    fetch("./geojson/SOTA/sota.geojson")
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

                    // Popup ONLY — no shading, no highlighting
                    layer.bindPopup(`
                        <strong>${p.summitName}</strong><br>
                        Code: ${p.summitCode}<br>
                        Altitude: ${p.altM} m (${p.altFt} ft)<br>
                        Points: ${p.points}<br>
                        Bonus: ${p.bonusPoints}<br>
                        Activations: ${p.activationCount}
                    `);

                    // Click = popup only
                    layer.on("click", () => {
                        layer.openPopup();
                    });
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
        loadAllPotaBoundaries();
        loadAllPotaTrails();
        mcdLoadMarkers();
        sotaLoadLayers();
        sotaZoneLoadLayers();
        picnicSitesLoadMarkers();
    })
    .catch(err => console.error("Error loading CY parks:", err));

////////////////////
// LEGEND         //
////////////////////

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'pota-legend');

    // *** REQUIRED: allow clicks to propagate so our collapse handler works
    L.DomEvent.disableClickPropagation(div);

    div.innerHTML = `
        <div id="legend-menu" class="collapsed">

            <!-- Header -->

            <div id="legend-content">

                <!-- Section: Credits -->
                <div class="legend-section-title">Credits</div>
                    Creator: M1GRY with CoPilot<br>
                    Updated: 03-Sep-2026<br>
                    Version: V16.2<br><br>

                <!-- Section: POTA Categories -->
                <div class="legend-section-title">POTA Categories</div>
                    <i style="background: ${COLOUR_ATNO}"></i> ATNO<br>
                    <i style="background: ${COLOUR_NATURA}"></i> Natura 2000<br>
                    <i style="background: ${COLOUR_SCENIC_TRAIL}"></i> Scenic Trail<br>
                    <i style="background: ${COLOUR_NATIONAL_FOREST}"></i> National Forest<br>
                    <i style="background: ${COLOUR_ARCHEOLOGICAL}"></i> Archeological Reserve<br>
                    <i style="background: ${COLOUR_DEFAULT}"></i> Other<br>
                    <i style="background: ${COLOUR_ILLEGAL}"></i> Illegal<br>
            </div>
            <div id="legend-header">
                <span id="legend-triangle">&#9650;</span>
                Legend
            </div>
        </div>
    `;

    return div;
};
    

legend.addTo(map);

document.addEventListener("click", function(e) {
    if (e.target.id === "legend-header") {
        const box = e.target.parentElement;
        box.classList.toggle("collapsed");

        // Update arrow
        const triangle = e.target.querySelector("#legend-triangle");
        if (box.classList.contains("collapsed")) {
            triangle.innerHTML = "&#9650;";   // down arrow
        } else {
            triangle.innerHTML = "&#9660;";   // up arrow
        }
    }
});

////////////////
// GPS BUTTON //
////////////////

let locating = false;     // toggle state
let gpsMarker = null;
let gpsCircle = null;

function isInsideCyprus(lat, lng) {
    return (
        lat >= CYPRUS_MIN_LAT &&
        lat <= CYPRUS_MAX_LAT &&
        lng >= CYPRUS_MIN_LNG &&
        lng <= CYPRUS_MAX_LNG
    );
}

function clearGPSMarker() {
    if (gpsMarker) {
        map.removeLayer(gpsMarker);
        gpsMarker = null;
    }
    if (gpsCircle) {
        map.removeLayer(gpsCircle);
        gpsCircle = null;
    }
}
function showLocateIconColour(link) {
    link.innerHTML = `
        <img src="images/locate-target-on.jpg"
             width="28" height="28"
             style="display:block;margin:auto;">
    `;
}

function showLocateIconBlack(link) {
    link.innerHTML = `
        <img src="images/locate-target-off.jpg"
             width="28" height="28"
             style="display:block;margin:auto;">
    `;
}

const FakeLocateControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const link = L.DomUtil.create('a', '', container);

        link.href = '#';
        link.title = 'Locate';

        // initial "off" icon (black cross version)
        showLocateIconBlack(link);

        L.DomEvent.on(link, 'click', function(e) {
            L.DomEvent.preventDefault(e);
            L.DomEvent.stopPropagation(e);

            if (!locating) {
                // FIRST CLICK ? LOCATE
                locating = true;
                showLocateIconColour(link);

                console.log("Fake locate clicked — faking GPS…");

                map.fire('locationfound', {
                    latlng: L.latLng(CYPRUS_TEST_LAT, CYPRUS_TEST_LNG),
                    latitude: CYPRUS_TEST_LAT,
                    longitude: CYPRUS_TEST_LNG,
                    accuracy: 15
                });

            } else {
                // SECOND CLICK ? CLEAR
                locating = false;
                clearGPSMarker();
                showLocateIconBlack(link);
            }
        });

        return container;
    }
});


map.whenReady(() => {
    map.addControl(new FakeLocateControl());
});

/////////////////////////
// HANDLE CUSTOM ICONS //
/////////////////////////
let savedPins = JSON.parse(localStorage.getItem("customPins") || "[]");
savedPins.forEach(addCustomPinToMap);

function deleteCustomPin(lat, lon) {
    let pins = JSON.parse(localStorage.getItem("customPins") || "[]");

    // Remove the matching pin
    pins = pins.filter(p => p.lat !== lat || p.lon !== lon);

    // Save updated list
    localStorage.setItem("customPins", JSON.stringify(pins));

    // Clear the layer FIRST
    customPinsLayer.clearLayers();

    // Clear and redraw the layer
    pins.forEach(addCustomPinToMap);

    // Close popup
    map.closePopup();
}

function gotoGoogleMaps(lat, lon) {
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, "_blank");
}

function addCustomPinToMap(pin) {

    const icon = iconMap[pin.type] || parkingIcon;

    const marker = L.marker([pin.lat, pin.lon], { icon });

    marker.bindPopup(`
        <div class="popup-content">
            <b>${(pin.type || "parking").charAt(0).toUpperCase() + (pin.type || "parking").slice(1)} Pin</b>

            <div style="display:flex; align-items:center; gap:20px;">

                <img src="images/goto-google-maps.png"
                     width="28" height="28"
                     style="cursor:pointer;"
                     onclick="gotoGoogleMaps(${pin.lat}, ${pin.lon})">
                
                <img src="images/custom-remove.jpg"
                     width="28" height="28"
                     style="cursor:pointer;"
                     onclick="deleteCustomPin(${pin.lat}, ${pin.lon})">

                <img src="images/custom-cancel.jpg"
                     width="28" height="28"
                     style="cursor:pointer; margin-left:auto;"
                     onclick="map.closePopup()">

            </div>
        </div>
    `);

    marker.addTo(customPinsLayer);
}

function addCustomPin(lat, lon, type) {

    // Save to localStorage
    let pins = JSON.parse(localStorage.getItem("customPins") || "[]");
    pins.push({ lat, lon, type });
    localStorage.setItem("customPins", JSON.stringify(pins));

    // Choose icon based on type
    const icon = iconMap[type] || parkingIcon;

    // Create marker
    const marker = L.marker([lat, lon], { icon });

    // Popup
    marker.bindPopup(`
        <div class="popup-content">
            <b>${type.charAt(0).toUpperCase() + type.slice(1)} Pin</b><br><br>

            <div style="display:flex; align-items:center; gap:20px;">

                <button onclick="window.open('https://www.google.com/maps?q=${lat},${lon}', '_blank')">
                    goto Google Maps
                </button>

                <img src="images/custom-remove.jpg"
                     width="28" height="28"
                     style="cursor:pointer;"
                     onclick="deleteCustomPin(${lat}, ${lon})">

                <img src="images/custom-cancel.jpg"
                     width="28" height="28"
                     style="cursor:pointer; margin-left:auto;"
                     onclick="map.closePopup()">

            </div>
        </div>
    `);

    // Add to layer
    marker.addTo(customPinsLayer);

    // Ensure layer is visible
    if (!map.hasLayer(customPinsLayer)) {
        customPinsLayer.addTo(map);
    }

    // Close the "Add pin?" popup
    map.closePopup();
}


/////////////
// MAP ON ///
/////////////

function clickIsFromPopup(e) {
    let el = e.originalEvent.target;
    while (el) {
        if (el.classList && el.classList.contains("leaflet-popup")) {
            return true;
        }
        el = el.parentElement;
    }
    return false;
}

map.on('popupopen', () => {
    popupOpen = true;
    popupJustClosed = false;
});

map.on('popupclose', () => {
    popupOpen = false;
    popupJustClosed = true;

    // Cool-down: ignore the next click only
    setTimeout(() => popupJustClosed = false, 150);
});

map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    console.log("Map CLICK (not a pin)");
    // Reset trail highlight when clicking away
    if (activeTrail) {
        console.log("Removing highlight from", activeTrail.reference);
        activeTrail._trailLayer.setStyle({
            color: COLOUR_SCENIC_TRAIL,
            weight: 4,
            opacity: 0.9
        });
        activeTrail = null;
    }

    // Ignore clicks while popup is open
    if (popupOpen) {
        return;
    }

    // Ignore the click that *just* closed a popup
    if (popupJustClosed) {
        return;
    }

    L.popup()
        .setLatLng(e.latlng)
        .setContent(`
            <div class="popup-content">
                Add a custom pin here?<br><br>

                <div style="display:flex; align-items:center; gap:20px;">

                    <img src="images/custom-parking.jpg"
                         width="28" height="28"
                         style="cursor:pointer;"
                         onclick="addCustomPin(${lat}, ${lon}, 'parking')">


                    <!-- Spacer icon (knives & forks or anything you like) -->
                    <img src="images/custom-food.jpg"
                         width="28" height="28"
                         style="cursor:pointer;"
                         onclick="addCustomPin(${lat}, ${lon}, 'food')">

                    <img src="images/custom-cancel.jpg"
                         width="28" height="28"
                         style="cursor:pointer;"
                         onclick="map.closePopup()">

                </div>
            </div>
        `)
        .openOn(map);
});

map.on('locationfound', function(e) {

    // If user clicked the "clear" state, ignore GPS updates
    if (!locating) { return; }

    let lat = e.latitude;
    let lng = e.longitude;

    if (!isInsideCyprus(lat, lng)) {
        console.log("Real GPS outside Cyprus — using fake test coordinate.");
        lat = CYPRUS_TEST_LAT;
        lng = CYPRUS_TEST_LNG;
    } else {
        console.log("Real GPS inside Cyprus — using genuine coordinates.");
    }

    // Remove previous marker/circle
    if (gpsMarker) {
        map.removeLayer(gpsMarker);
    }
    if (gpsCircle) {
        map.removeLayer(gpsCircle);
    }

    gpsMarker = L.marker([lat, lng]);
    gpsCircle = L.circle([lat, lng], { radius: e.accuracy || 15 });

    gpsMarker.addTo(map);
    gpsCircle.addTo(map);

    map.setView([lat, lng], GPS_ZOOM_LEVEL);
});
const cycleControl = L.control({ position: 'topleft' });

cycleControl.onAdd = function(map) {
    const btn = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    btn.innerHTML = `
        <img src="images/map-base-layer.jpg"
             width="28" height="28"
             style="display:block;margin:auto;">
    `;
    btn.style.padding = "6px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "20px";
    btn.style.textAlign = "center";

    // Prevent map clicks when tapping this button
    L.DomEvent.disableClickPropagation(btn);

    btn.onclick = function() {
        map.removeLayer(baseLayers[currentBase]);
        currentBase = (currentBase + 1) % baseLayers.length;
        baseLayers[currentBase].addTo(map);

        // Optional visual feedback
        btn.style.background = "#ddd";
        setTimeout(() => btn.style.background = "", 150);
    };

    return btn;
};

cycleControl.addTo(map);

