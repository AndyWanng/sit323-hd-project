$(document).ready(function(){
    console.log('Page running');
    $(".dropdown-trigger").dropdown();

    const sideNavigation = document.querySelector('.sidenav');
    M.Sidenav.init(sideNavigation, {});
    let journalEntries = [];

    fetchUserInfo();
    fetchUserJournals();
});

function fetchUserInfo() {
    const userId = localStorage.getItem('userID');
    $.ajax({
        url: `http://35.244.184.68/account/info/${userId}`,
        type: 'GET',
        success: function(user) {
            $('#name').val(user.name);
            $('#username').val(user.username);
            $('#email').val(user.email);
            $('#birthdate').val(user.birthdate);
            $('#country').val(user.country);
            M.updateTextFields();
        },
        error: function(error) {
            console.error('Cannot retrieve user information', error);
        }
    });
}

function updateUserInfo() {
    const userId = localStorage.getItem('userID');
    const updatedData = {
        name: $('#name').val(),
        username: $('#username').val(),
        email: $('#email').val(),
        birthdate: $('#birthdate').val(),
        country: $('#country').val()
    };

    $.ajax({
        url: `http://35.244.184.68/account/update/${userId}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(updatedData),
        success: function(response) {
            console.log(response.message);
        },
        error: function(error) {
            console.error('更新用户信息失败', error);
        }
    });
}

const fetchUserJournals = () => {
    const userId = localStorage.getItem('userID');
    fetch(`http://35.244.184.68/account/journals/${userId}`)
        .then(response => response.json())
        .then(data => {
            journalEntries = data;
            displayJournals(data);
        })
        .catch(error => console.error('Error:', error));
};

const displayJournals = (entries) => {
    const container = document.getElementById('journal-entries');
    container.innerHTML = '';
    entries.forEach(entry => {
        const cardPanel = document.createElement('div');
        cardPanel.className = 'col s12 m6';
        cardPanel.innerHTML = `
            <div class="card-panel">
                <i class="material-icons large teal-text">place</i>
                <h4 class="font">${entry.destination}</h4>
                <p class="font">${entry.description}</p>
            </div>
        `;
        container.appendChild(cardPanel);
    });
};

$('#update-profile-btn').on('click', function(event) {
    event.preventDefault();
    updateUserInfo();
});
