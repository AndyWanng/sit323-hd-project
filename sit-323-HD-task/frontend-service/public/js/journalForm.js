$(document).ready(function(){
    console.log('form is running!');
    $('.modal').modal();
});

const firebaseConfig = {
    apiKey: "AIzaSyBKO6CwCY-LW_0e6ly7M7IDlODF5jwFjkc",
    authDomain: "smarttravel-f668c.firebaseapp.com",
    projectId: "smarttravel-f668c",
    storageBucket: "smarttravel-f668c.appspot.com",
    messagingSenderId: "80277755145",
    appId: "1:80277755145:web:515cc5773c11e8cae02fd8",
    measurementId: "G-ZSH176JT4Z"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const uploadImages = async (files) => {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = storage.ref().child('journal_images/' + file.name);
        const uploadTask = storageRef.put(file);

        promises.push(new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {},
                (error) => { reject(error); },
                async () => {
                    const downloadURL = await storageRef.getDownloadURL();
                    resolve(downloadURL);
                }
            );
        }));
    }
    return Promise.all(promises);
};

const submit = async () => {
    let destination = $("#destination").val();
    let comfort = $("#comfort").val();
    let budget = $("#budget").val();
    let description = $("#description").val();
    let link = $("#link").val();
    let rate = $("#rate").val();
    let userID = localStorage.getItem('userID');
    const files = document.getElementById('images').files;

    if (destination == null || destination.trim() === '') {
        alert("Sorry invalid entry, destination is mandatory, e.g. (place)");
        return false;
    }
    if (budget == null || budget.trim() === '') {
        alert("Sorry invalid entry, budget is mandatory, e.g. (50 aud)");
        return false;
    }
    if (description == null || description.length < 20) {
        alert("Sorry invalid entry, description is mandatory. At least 20 characters.");
        return false;
    }
    if (rate == null || rate.trim() === '') {
        alert("Sorry invalid entry, rate is mandatory e.g 1- 10");
        return false;
    }

    const imageLinks = await uploadImages(files);

    let journal = {
        userID: userID,
        destination: destination,
        comfort: comfort,
        budget: budget,
        description: description,
        link: link,
        rate: rate,
        images: imageLinks
    };

    $.ajax({
        url: 'http://35.244.184.68/journal/api/journal',
        contentType: 'application/json',
        data: JSON.stringify(journal),
        type: 'POST',
        success: function (result) {
            if (result.result == 200) {
                alert('Congratulations! Your journal has been created!');
                window.location.replace('../html/journal.html');
            } else if (result.result == 404) {
                alert('Failed to publish!');
            }
        }
    });
};

$(document).ready(function(){
    console.log('Home page running');
    $(".dropdown-trigger").dropdown();
});

const clear = () => {
    $('#form1').find('input:text').val('');
};

const back = () => {
    window.location.replace('../html/journal.html');
};

const sideNavigation = document.querySelector('.sidenav');
M.Sidenav.init(sideNavigation, {});

