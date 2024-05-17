$(document).ready(function() {
    console.log('Home page running');
    $(".dropdown-trigger").dropdown();
    fetchSchedules();

    const sideNavigation = document.querySelector('.sidenav');
    M.Sidenav.init(sideNavigation, {});
    $('.modal').modal();
});

let scheduleEntries = [];
let currentPage = 1;
const entriesPerPage = 4;

const fetchSchedules = () => {
    fetch('http://35.244.184.68/schedule/api/schedules')
        .then(response => response.json())
        .then(data => {
            scheduleEntries = data;
            displaySchedules();
            setupPagination();
        })
        .catch(error => console.error('Error:', error));
};

const displaySchedules = () => {
    const container = document.getElementById('schedule-entries');
    container.innerHTML = '';
    const start = (currentPage - 1) * entriesPerPage;
    const end = start + entriesPerPage;
    const paginatedEntries = scheduleEntries.slice(start, end);
    paginatedEntries.forEach((entry, index) => {
        const cardPanel = document.createElement('div');
        cardPanel.className = 'col s12 m6';
        cardPanel.innerHTML = `
            <div class="card-panel" onclick="showModal(${entry.id})">
                <i class="material-icons large teal-text">place</i>
                <h4 class="font">${entry.departure}</h4>
                <h4 class="font">${entry.destination}</h4>
                <p class="font">${entry.description.substring(0, 50)}...</p>
            </div>
        `;
        container.appendChild(cardPanel);
    });
};

const setupPagination = () => {
    const totalPages = Math.ceil(scheduleEntries.length / entriesPerPage);
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
};

const changePage = (page) => {
    const totalPages = Math.ceil(scheduleEntries.length / entriesPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displaySchedules();
    updatePagination();
};

const updatePagination = () => {
    const totalPages = Math.ceil(scheduleEntries.length / entriesPerPage);
    document.getElementById('prev-page').classList.toggle('disabled', currentPage === 1);
    document.getElementById('next-page').classList.toggle('disabled', currentPage === totalPages);
    document.querySelectorAll('.page-number').forEach(pageNumber => {
        pageNumber.classList.toggle('active', Number(pageNumber.dataset.page) === currentPage);
    });
};

const searchSchedules = () => {
    const searchTerm = document.getElementById('autocomplete-input').value.toLowerCase();
    const filteredEntries = scheduleEntries.filter(entry => entry.destination.toLowerCase().includes(searchTerm));
    scheduleEntries = filteredEntries;
    currentPage = 1;
    displaySchedules();
    setupPagination();
};

const launch = () => {
    window.location.replace('../html/scheduleForm.html');
};

const showModal = (id) => {
    const entry = scheduleEntries.find(e => e.id === id);
    if (entry) {
        document.getElementById('modal-departure').innerText = `Departure: ${entry.departure}`;
        document.getElementById('modal-destination').innerText = `Destination: ${entry.destination}`;
        document.getElementById('modal-description').innerText = `Description: ${entry.description}`;
        document.getElementById('modal-length').innerText = `Length: ${entry.length}`;
        document.getElementById('modal-budget').innerText = `Budget: ${entry.budget}`;

        const modalLinkElement = document.getElementById('modal-link');
        if (entry.link) {
            modalLinkElement.innerText = `Link: ${entry.link}`;
            modalLinkElement.style.display = 'block';
        } else {
            modalLinkElement.style.display = 'none';
        }

        document.getElementById('modal-expectation').innerText = `Expectation: ${entry.expectation}`;

        const planRouteBtn = document.getElementById('plan-route-btn');
        planRouteBtn.href = `plan.html?departure=${encodeURIComponent(entry.departure)}&destination=${encodeURIComponent(entry.destination)}`;

        const modal = M.Modal.getInstance(document.getElementById('schedule-modal'));
        modal.open();
    }
};

