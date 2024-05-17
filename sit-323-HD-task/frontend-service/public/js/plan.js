let map;
let directions;

$(document).ready(function() {
    console.log('Plan page running');
    $(".dropdown-trigger").dropdown();

    const sideNavigation = document.querySelector('.sidenav');
    M.Sidenav.init(sideNavigation, {});

    const urlParams = new URLSearchParams(window.location.search);
    const departure = urlParams.get('departure');
    const destination = urlParams.get('destination');

    console.log('URL Parameters:', { departure, destination });

    if (departure && destination) {
        const directionInputs = document.getElementsByClassName('mapboxgl-ctrl-geocoder');
        for (let input of directionInputs) {
            input.style.display = 'none';
        }

        if (isCoordinates(departure) && isCoordinates(destination)) {
            let departureCoords = departure.split(',').map(coord => parseFloat(coord.trim()));
            let destinationCoords = destination.split(',').map(coord => parseFloat(coord.trim()));
            let [lng1, lat1] = departureCoords;
            departureCoords = [lat1, lng1];
            let [lng2, lat2] = destinationCoords;
            destinationCoords = [lat2, lng2];


            console.log('Parsed Coordinates:', { departureCoords, destinationCoords });

            if (isValidCoordinate(departureCoords) && isValidCoordinate(destinationCoords)) {
                setupMap(departureCoords);

                directions.setOrigin(departureCoords);
                directions.setDestination(destinationCoords);
            } else {
                console.error('Invalid coordinates.');
            }
        } else {
            getCoordinates(departure, destination);
        }
    } else {
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
            enableHighAccuracy: true
        });
    }
});

mapboxgl.accessToken = '';

function successLocation(position) {
    setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
    setupMap([144.9631, -37.8136]);
}

function setupMap(center) {
    console.log('Setting up map with center:', center);

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 15
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving'
    });

    map.addControl(directions, 'top-left');
}

function getCoordinates(departure, destination) {
    const geocodingUrl = (place) => `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${mapboxgl.accessToken}`;

    Promise.all([
        fetch(geocodingUrl(departure)).then(response => response.json()),
        fetch(geocodingUrl(destination)).then(response => response.json())
    ]).then(data => {
        console.log('Geocoding data:', data);

        if (!data[0].features || !data[0].features[0] || !data[1].features || !data[1].features[0]) {
            console.error('Error fetching coordinates: Data does not contain required features.');
            return;
        }

        const departureCoords = data[0].features[0].center;
        const destinationCoords = data[1].features[0].center;

        console.log('Geocoded Coordinates:', { departureCoords, destinationCoords });

        if (!map) {
            setupMap(departureCoords);
        } else {
            map.setCenter(departureCoords);
        }

        directions.setOrigin(departureCoords);
        directions.setDestination(destinationCoords);
    }).catch(error => console.error('Error fetching coordinates:', error));
}

function isCoordinates(str) {
    const coords = str.split(',');
    return coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]);
}

function isValidCoordinate(coords) {
    const [lng, lat] = coords;
    console.log(`Validating coordinates: lat=${lat}, lng=${lng}`);
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

const openaiApiKey = '';

function getTripAdvice() {
    const duration = document.getElementById('durationInput').value;
    const urlParams = new URLSearchParams(window.location.search);
    const departure = urlParams.get('departure');
    const destination = urlParams.get('destination');

    if (!departure || !destination || !duration) {
        displayResponse("Please enter all the required information.");
        return;
    }

    const userInput = `I am planning a trip from ${departure} to ${destination} for ${duration} days. Can you give me some travel advice in good format?`;

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{"role": "user", "content": userInput}]
        })
    })
        .then(response => response.json())
        .then(data => {
            const responseText = data.choices[0].message.content;
            displayResponse(responseText);
        })
        .catch(error => console.error('Error:', error));
}

function displayResponse(responseText) {
    const chatContainer = document.getElementById('chatContainer');
    const responseElement = document.createElement('div');
    responseElement.className = 'chat-response';
    responseElement.innerHTML = `
                <span class="close-btn" onclick="this.parentElement.remove()">x</span>
                <p>${responseText}</p>
            `;
    chatContainer.appendChild(responseElement);
}

function openChat() {
    document.getElementById('floatingChat').classList.add('show');
}

$(document).ready(function() {
    openChat();
});
