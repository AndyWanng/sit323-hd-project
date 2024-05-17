$(document).ready(function() {
    console.log('Guide page running');
    $(".dropdown-trigger").dropdown();
    $('.modal').modal();

    const sideNavigation = document.querySelector('.sidenav');
    M.Sidenav.init(sideNavigation, {});

    let places = [];
    const placesPerPage = 4;
    let currentPage = 1;

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query) {
        $('#autocomplete-input').val(query);
        searchPlaces(query);
    }

    $('#autocomplete-input').on('input', function() {
        searchPlaces($(this).val());
    });

    function searchPlaces(query) {
        if (query) {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            const request = {
                query: query,
                fields: ['name', 'geometry', 'formatted_address', 'rating', 'user_ratings_total', 'photos', 'types', 'opening_hours']
            };

            service.textSearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    places = results;
                    currentPage = 1;
                    displayPlaces();
                    setupPagination();
                } else {
                    console.error('Error fetching data', status);
                }
            });
        } else {
            console.error('Search query is empty.');
        }
    }

    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject(new Error('Geolocation is not supported by this browser.'));
            }
        });
    }

    function fetchPlacesNearby(latitude, longitude) {
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        const request = {
            location: new google.maps.LatLng(latitude, longitude),
            radius: 50000,
            type: ['tourist_attraction']
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                places = results;
                displayPlaces();
                setupPagination();
            } else {
                console.error('Error fetching data', status);
            }
        });
    }

    function displayPlaces() {
        const placesRow = $('#places-row');
        placesRow.empty();

        const startIndex = (currentPage - 1) * placesPerPage;
        const endIndex = startIndex + placesPerPage;
        const currentPlaces = places.slice(startIndex, endIndex);

        currentPlaces.forEach(place => {
            const address = place.formatted_address || place.vicinity;
            const placeCard = `
                <div class="col s12 m6">
                    <div class="card-panel place-card" data-place='${JSON.stringify(place)}'>
                        <i class="material-icons large teal-text">place</i>
                        <h4 class="font">${place.name}</h4>
                        <p class="font">${address}</p>
                    </div>
                </div>
            `;
            placesRow.append(placeCard);
        });

        $('.place-card').click(function() {
            const place = $(this).data('place');
            let photoUrl = '';

            if (place.photos && place.photos.length > 0) {
                photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=`;
            }

            $('#modal-title').text(place.name);
            $('#modal-content').html(`
                <p><strong>Address:</strong> ${place.formatted_address || 'Address not available'}</p>
                <p><strong>Rating:</strong> ${place.rating} (${place.user_ratings_total} reviews)</p>
                <p><strong>Open Now:</strong> ${place.opening_hours ? (place.opening_hours.open_now ? 'Yes' : 'No') : 'N/A'}</p>
                <p><strong>Types:</strong> ${place.types.join(', ')}</p>
                ${photoUrl ? `<img src="${photoUrl}" alt="${place.name}" style="width:100%;height:auto;">` : '<p>No photos available</p>'}
            `);
            $('#modal1').modal('open');

            $('#navigate-button').data('place', place);
        });

        updatePagination();
    }

    function setupPagination() {
        const totalPages = Math.ceil(places.length / placesPerPage);
        const pagination = document.querySelector('.pagination');

        pagination.innerHTML = `
            <li class="waves-effect" id="prev-page"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
            ${Array.from({ length: totalPages }, (_, i) => `<li class="waves-effect page-number" data-page="${i + 1}"><a href="#!">${i + 1}</a></li>`).join('')}
            <li class="waves-effect" id="next-page"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
        `;

        document.getElementById('prev-page').addEventListener('click', () => changePage(currentPage - 1));
        document.getElementById('next-page').addEventListener('click', () => changePage(currentPage + 1));
        document.querySelectorAll('.page-number').forEach(pageNumber => {
            pageNumber.addEventListener('click', (event) => changePage(Number(event.target.textContent)));
        });

        updatePagination();
    }

    function changePage(page) {
        const totalPages = Math.ceil(places.length / placesPerPage);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        displayPlaces();
        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(places.length / placesPerPage);
        document.getElementById('prev-page').classList.toggle('disabled', currentPage === 1);
        document.getElementById('next-page').classList.toggle('disabled', currentPage === totalPages);
        document.querySelectorAll('.page-number').forEach(pageNumber => {
            pageNumber.classList.toggle('active', Number(pageNumber.dataset.page) === currentPage);
        });
    }

    function initApp() {
        getCurrentLocation()
            .then(position => {
                const { latitude, longitude } = position.coords;
                fetchPlacesNearby(latitude, longitude);
            })
            .catch(error => {
                console.error('Error getting current location', error);
            });
    }

    initApp();

    $('#navigate-button').click(function() {
        const place = $(this).data('place');
        if (place) {
            getCurrentLocation()
                .then(position => {
                    const { latitude, longitude } = position.coords;
                    const departure = `${latitude},${longitude}`;
                    const destination = `${place.geometry.location.lat},${place.geometry.location.lng}`;

                    window.location.href = `plan.html?departure=${encodeURIComponent(departure)}&destination=${encodeURIComponent(destination)}`;
                })
                .catch(error => {
                    console.error('Error getting current location', error);
                });
        }
    });
});
