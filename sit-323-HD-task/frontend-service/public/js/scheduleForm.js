$(document).ready(function(){
    console.log('form is running!');
    $('.model').modal();
})

const clear=()=>{
}

const back=()=>{
    window.location.replace('../html/schedule.html');
};

let destination = null;
let comfort = null;
let budget = null;
let description = null;
let link = null;
let expectation = null;
let length = null
let departure = null;

const submit=()=>{
    let departure = $("#departure").val();
    let destination = $("#destination").val();
    let length = $("#length").val();
    let budget = $("#budget").val();
    let description = $("#description").val();
    let link = $("#link").val();
    let expectation = $("#expectation").val();
    let userID = localStorage.getItem('userID');

    if(destination == null) {
        alert("Sorry invalid entry, destination is mandatory, e.g. (place)");
        return false;
    }
    if(budget == null) {
        alert("Sorry invalid entry, budget is mandatory, e.g. (50 aud)");
        return false;
    }
    if(description == null || description.length < 20 ) {
        alert("Sorry invalid entry, description is mandatory. Atleast 20 characters.");
        return false;
    }


    let schedule = {
        userID: userID,
        departure: departure,
        destination: destination,
        length: length,
        budget: budget,
        description: description,
        link: link,
        expectation: expectation
    };

    $.ajax({
        url: 'http://35.244.184.68/api/schedule',
        contentType: 'application/json',
        data: JSON.stringify(schedule),
        type: 'POST',
        success: function(result){
            if(result.result === 200){
                alert('Congratulation! Your schedule has been created!');
                window.location.replace('../html/schedule.html');
            }
            else if (result.result === 404) {
                alert('Failed to publish!');
            }
        }
    });
};

$(document).ready(function(){
    console.log('Home page running');
    $(".dropdown-trigger").dropdown();

});

const sideNavigation = document.querySelector('.sidenav');
M.Sidenav.init(sideNavigation, {});