const signInWithGoogleButton = document.getElementById('signInWithGoogle');
const auth = firebase.auth();

function signInWithGoogle (){
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(googleProvider)
    .then((result) => {
        var user = result.user;  
        console.log(user);
    })
    .catch(error => {
        console.error(error);
    })
}
signInWithGoogleButton.addEventListener("click", signInWithGoogle);

//Create a password based account

firebase.auth().onAuthStateChanged((user) => {
    setupUI(user);
});

const btnLogout = document.querySelector('#btnLogout');
btnLogout.addEventListener('click', (user) => {
    firebase.auth().signOut();
    console.log('Logout complete.');
});

const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');

function setupUI(user) {
    if (user) {
        document.querySelector('#user-profile-name').innerHTML = user.displayName;
        document.querySelector('#user-pic').src = user.photoURL;
        document.querySelector('#user-profile-name').style.display = 'inline-block';
        document.querySelector('#user-pic').style.display = 'inline-block';
        loginItems.forEach(item => item.style.display = 'inline-block');
        logoutItems.forEach(item => item.style.display = 'none');
    }
     else {
        document.querySelector('#user-profile-name').style.display = 'none';
        document.querySelector('#user-pic').style.display = 'none';
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'inline-block');
    }
}