$(document).ready(function(){
    $('.datepicker').datepicker();
    $('.model').modal();
});

let username = null;
let name = null;
let birthdate = null;
let country = null; 
let email = null;
let password = null;

const submit=()=>{
    let username = $('#username').val();
    let name = $('#name').val();
    let birthdate = $('#birthdate').val();
    let country = $('#country').val(); 
    let email = $('#email').val();
    let password = $('#password').val(); 

    if(username.length < 1) {
        alert("Sorry invalid entry, username is mandatory");
        return false;
    }
    if(name == null) {
        alert("Sorry invalid entry, name is mandatory");
        return false;
    }
    if(birthdate == null) {
        alert("Sorry invalid entry, birth date is mandatory");
        return false;
    }
    if(country == null ) {
        alert("Sorry invalid entry, country is mandatory");
        return false;
    }
    if(email == null ) {
        alert("Sorry invalid entry, email is mandatory");
        return false;
    }
    if(password == null || password.length < 6 ) {
        alert("Sorry invalid entry, password is mandatory, must require atleast 6 characters");
        return false;
    }

    let account = {
        username: username,
        name: name,
        birthdate: birthdate,
        country: country,
        email: email,
        password: password
    }; 
    $.ajax({
        url: 'http://35.244.184.68/signup/api/account',
        contentType: 'application/json',
        data: JSON.stringify(account),
        type: 'POST',
        success: function(result){
            if(result.result == 200){
                alert('Congratulation! Your account has been created!');
                window.location.replace('/index.html');
            }
            else if (result.result == 404) {
                alert('Account existing in the database!');
            }
        }
    });
};


const clear=()=>{
    $('#username').val('');
    $('#name').val('');
    $('#birthdate').val('');
    $('#country').val(''); 
    $('#email').val('');
    $('#password').val(''); 
    alert('hi');
};

const back=()=>{
    window.location.replace('/index.html');
    
};




