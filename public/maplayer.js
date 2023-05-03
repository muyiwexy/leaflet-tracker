
const map = L.map('map', {
    center: [0, 0],
    zoom: 3
})

const layer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tilelayer = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const osm = L.tileLayer(layer, { attribution: tilelayer }).addTo(map);

function onMarkerClick(e) {
    var contained = polygon.contains(e.latlng);
    if (contained) {
        console.log("figure it out")
    } else {
        console.log("do not bother")
    }
}
// create a red polygon from an array of LatLng points
var latlngs = [[19, -178], [40, 190], [36, -190], [180, -90], [-180, -90]];
// var latlngs = [[19, -178], [40, 190], [36, -190], [180, -90]];

var polygon = L.polygon(latlngs, { color: 'red' }).addTo(map);
// var polygon = L.polygon(latlngs, { color: 'red' }).addTo(map);
var popup = L.popup();
// var A = L.marker([-21, -109.05]).addTo(map).on('click', onMarkerClick);
// var B = L.marker([-22, -109.03]).addTo(map)
// var C = L.marker([-23, -102.05]).addTo(map)
// var D = L.marker([37, -102.04]).addTo(map)
// var centerpoint = L.marker([39, -105.5425]).addTo(map)
// var AB = L.marker([39, -109.04]).addTo(map)

var marker;
var content
let firsttime = true;
async function plotmarker() {
    const dataset = await getData();
    const getid = dataset.mainid;
    const getlat = dataset.mainlat;
    const getlong = dataset.mainlong;
    document.getElementById('long').textContent = getlong;
    document.getElementById('lat').textContent = getlat;
    for (let i = 0; i < getlat.length; i++) {
        marker = L.marker([getlat[i], getlong[i]]).on('click', onMarkerClick);
        content = '<h1>' + getid[i] + '</h1><br/><p>latitude: <span>' + getlat[i] + '</span> <br /> longitude: <span>' + getlong[i] + '</span> <br /></p>'
        marker.addTo(map);
        marker.bindPopup(content);
        map.setView([getlat[i], getlong[i]], 8);
    }
    // await mylocation();
}


// async function mylocation() {
//     if ('geolocation' in navigator) {
//         console.log("Your browser supports geolocation feature!")
//         navigator.geolocation.getCurrentPosition(getPosition => {
//             var lat = getPosition.coords.latitude;
//             var lng = getPosition.coords.longitude;
//             const dataobj = {lat, lng};
//             const options = {
//                 method: "POST",
//                 headers: {
//                     'Content-Type':'application/json'
//                 },
//                 body: JSON.stringify(dataobj)
//             }
//             fetch ('/api', options);
//             console.log(lat, lng);

//             if (firsttime) {
//                 var marked = marker.setLatLng([lat, lng]);

//                 marked.addTo(map)

//                 map.setView([lat, lng], 8);
//                 firsttime = false
//             }
//             document.getElementById('long').innerHTML = lat;
//             document.getElementById('lat').innerHTML = lng;
//         });
//     } else {
//         console.log("Your browser doesn't support geolocation feature!")
//     };
// }
// setInterval(mylocation, 1000)
var interval;
const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';
async function getISS() {
    const response = await fetch(api_url);
    const data = await response.json();
    const { latitude, longitude, timestamp } = data;
    const date = new Date(timestamp);
    document.getElementById('long').innerHTML = longitude;
    document.getElementById('lat').innerHTML = latitude;

    var marked = marker.setLatLng([latitude, longitude]);
    content = '<h1>' + date + '</h1><br/><p>latitude: <span>' + latitude + '</span> <br /> longitude: <span>' + longitude + '</span> <br /></p>'
    marked.bindPopup(content)
    onMarkerClick()
    async function onMarkerClick() {
        var contained = polygon.contains(marked.getLatLng());
        if (contained) {
            const dataobj = { latitude, longitude, timestamp };
            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataobj)
            }
            const responsedata = await fetch('/api', options)
            const json = await responsedata.json();
            console.log(json)
        } else {
            console.log("do not bother")
        }
    }

    marked.addTo(map)
    if (firsttime) {

        map.setView([latitude, longitude], 2);
        firsttime = false
    }

}

function start() {
    this.disabled = true;
    document.getElementById("stop").disabled = false;
    interval = setInterval(getISS, 2000);
}

function stop() {
    document.getElementById("start").disabled = false;
    this.disabled = true;
    clearInterval(interval)
}

document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);
// getISS();
