const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;
const mapDiv = document.getElementById('map')!;

const GOOGLE_API_KEY = 'AIzaSyBePwQyvAGKFnJYsDttln04RVSJM7CIMok';
declare let google: any;
let marker: any;
let map = new google.maps.Map(mapDiv, { center: { lat: 0, lng: 0 }, zoom: 16 });

async function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress: string = addressInput.value;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${enteredAddress}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== 'OK') throw new Error('Could not fetch location!');
        const coordinates = data.results[0].geometry.location;
        map.setCenter(coordinates);
        if (marker) marker.setMap(null);
        marker = new google.maps.Marker({ position: coordinates, map: map });
    } catch (err) {
        console.log(err);
    }
}

async function createMarkupHandler(event: any) {
    let isMarker = event.placeId as boolean;
    let icon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    if (!isMarker) {
        if (marker) marker.setMap(null);
        marker = new google.maps.Marker({ position: event.latLng, map, icon });
        createInfoWindowHandler(event.latLng, marker);
    } else return;
}

async function createInfoWindowHandler(latLng: any, marker: any) {
    let infowindow = new google.maps.InfoWindow({ content: 'oi', ariaLabel: "Uluru", position: latLng });
    infoWindowOpenHandler(infowindow, marker);
    marker.addListener("click", () => infoWindowOpenHandler(infowindow, marker));
}

function infoWindowOpenHandler(infowindow: any, marker: any) {
    infowindow.open({
        anchor: marker,
        map,
    });
}

form.addEventListener('submit', searchAddressHandler);
map.addListener("click", createMarkupHandler);


