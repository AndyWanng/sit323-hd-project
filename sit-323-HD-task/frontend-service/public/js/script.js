let username = null;
let password = null;

const submit=()=>{
    let username = $('#username').val();
    let password = $('#password').val();

    if(username == null || username.length < 6 ) {
        alert("Sorry invalid entry, username is mandatory, must require at least 6 characters");
        return false;
    }
    if(password == null || password.length < 6 ) {
        alert("Sorry invalid entry, password is mandatory, must require at least 6 characters");
        return false;
    }

    let account = {
        username: username,
        password: password
    };
    
    $.ajax({
        url: 'http://35.244.184.68/login/api/verify',
        contentType: 'application/json',
        data: JSON.stringify(account),
        type: 'POST',
        success: function(result){
            if(result.result === 200){
                localStorage.setItem('username', account.username);
                localStorage.setItem('userID', result.userID);
                alert('Successfully logged !');
                window.location.replace('../html/home.html');
            }
            else if (result.result === 404) {
                alert('Incorrect password or username, please try again!');
            }
        }
    });
};

const clear=()=>{
    $('#username').val('');
    $('#password').val(''); 
    //console.log('clicked');
};

const Signup=()=>{
    window.location.replace('../html/signup.html');
};


$(document).ready(function(){
    console.log('page started!');
    
})

 