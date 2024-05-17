$(document).ready(function(){
    console.log('Home page running');
    $(".dropdown-trigger").dropdown();
    $('.modal').modal();
    const sideNavigation = document.querySelector('.sidenav');
    M.Sidenav.init(sideNavigation, {});
    fetchJournals();
});

let journalEntries = [];
let currentPage = 1;
const entriesPerPage = 4;

const fetchJournals = () => {
    fetch('http://35.244.184.68/journal/api/journals')
        .then(response => response.json())
        .then(data => {
            journalEntries = data;
            displayJournals();
            setupPagination();
        })
        .catch(error => console.error('Error:', error));
};

const displayJournals = () => {
    const container = document.getElementById('journal-entries');
    container.innerHTML = '';
    const start = (currentPage - 1) * entriesPerPage;
    const end = start + entriesPerPage;
    const paginatedEntries = journalEntries.slice(start, end);
    paginatedEntries.forEach((entry, index) => {
        const cardPanel = document.createElement('div');
        cardPanel.className = 'col s12 m6';
        cardPanel.innerHTML = `
            <div class="card-panel" onclick="showJournalDetails(${index})">
                <i class="material-icons large teal-text">place</i>
                <h4 class="font">${entry.destination}</h4>
                <p class="font">${entry.description}</p>
            </div>
        `;
        container.appendChild(cardPanel);
    });
};

const setupPagination = () => {
    const totalPages = Math.ceil(journalEntries.length / entriesPerPage);
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
    const totalPages = Math.ceil(journalEntries.length / entriesPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displayJournals();
    updatePagination();
};

const updatePagination = () => {
    const totalPages = Math.ceil(journalEntries.length / entriesPerPage);
    document.getElementById('prev-page').classList.toggle('disabled', currentPage === 1);
    document.getElementById('next-page').classList.toggle('disabled', currentPage === totalPages);
    document.querySelectorAll('.page-number').forEach(pageNumber => {
        pageNumber.classList.toggle('active', Number(pageNumber.dataset.page) === currentPage);
    });
};

const searchJournals = () => {
    const searchTerm = document.getElementById('autocomplete-input').value.toLowerCase();
    const filteredEntries = journalEntries.filter(entry => entry.destination.toLowerCase().includes(searchTerm));
    journalEntries = filteredEntries;
    currentPage = 1;
    displayJournals();
    setupPagination();
};

const launch = () => {
    window.location.replace('../html/journalForm.html');
};

const showJournalDetails = (index) => {
    const entry = journalEntries[index];
    if (entry) {
        document.getElementById('modal-destination').innerText = entry.destination;
        document.getElementById('modal-description').innerText = entry.description;
        document.getElementById('modal-comfort').innerText = `Comfort: ${entry.comfort}`;
        document.getElementById('modal-budget').innerText = `Budget: ${entry.budget}`;
        document.getElementById('modal-rate').innerText = `Rate: ${entry.rate}`;

        const carousel = document.getElementById('modal-carousel');
        carousel.innerHTML = '';
        entry.images.forEach((image, idx) => {
            const div = document.createElement('div');
            div.className = 'carousel-item';
            div.innerHTML = `<img src="${image}" alt="Journal Image ${idx + 1}" style="width: 100%;">`;
            carousel.appendChild(div);
        });

        let instances = M.Carousel.getInstance(carousel);
        if (instances) {
            instances.destroy();
        }

        const instance = M.Carousel.init(carousel, {
            fullWidth: true,
            indicators: true,
            noWrap: false
        });

        setTimeout(() => {
            instance.set(0);
        }, 100);

        $('#journal-modal').modal('open');
    }
};
