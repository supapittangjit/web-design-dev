const signInWithGoogleButton = document.getElementById('signInWithGoogle');
const auth = firebase.auth();

function signInWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(googleProvider)
        .then((result) => {
            var user = result.user;
            username = result.user.displayName;
            console.log(user);
        })
        .catch(error => {
            console.error(error);
        })
}
signInWithGoogleButton.addEventListener("click", signInWithGoogle);

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
        document.querySelector('#user-profile-name').innerHTML = username;
        document.querySelector('#user-profile-name').style.display = 'inline-block';
        document.querySelector('#user-pic').style.display = 'inline-block';
        loginItems.forEach(item => item.style.display = 'inline-flex');
        logoutItems.forEach(item => item.style.display = 'none');
        if(user.photoURL){
            document.querySelector('#user-pic').src = user.photoURL;
        }
        else{
            document.querySelector('#user-pic').src = 'default-user-photo.jpg'
        }
        
    } else {
        document.querySelector('#user-profile-name').style.display = 'none';
        document.querySelector('#user-pic').style.display = 'none';
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'flex');
    }
}

//Create a password based account

const ref2 = firebase.database().ref("UserList");
const signupForm = document.querySelector("#signup-form");

var username = '';

signupForm.addEventListener("submit", event => {
    createUser(event);
});

const signupFeedback = document.querySelector('#feedback-msg-signup');
const signupModal = new bootstrap.Modal(document.querySelector('#modal-signup'));

function createUser(event) {
    event.preventDefault();
    const email = signupForm['input-email-signup'].value;
    const pwd = signupForm['input-password-signup'].value;
    username = signupForm['input-name-signup'].value;
    
    const user = firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then(() => {
            signupFeedback.style = `color:green`;
            signupFeedback.innerText = `Sign up completed.`;
            setTimeout(function() {
                signupModal.hide();
            }, 1000);
            signupForm.reset();
            signupFeedback.innerHTML = ``
            const user = firebase.auth().currentUser;
        return user.updateProfile({
          displayName: username
        })
        })
        .catch((error) => {
            signupFeedback.style = `color:crimson`;
            signupFeedback.innerText = `${error.message}`;
            signupForm.reset();
        });
        setupUI();
}


//Cancel
const btnCancel= document.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        signupForm.reset();
        signupFeedback.innerHTML = ``
        loginForm.reset();
        loginFeedback.innerHTML = ``
    })
});

//Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', loginUser);

const loginFeedback = document.querySelector('#feedback-msg-login');
const loginModal = new bootstrap.Modal(document.querySelector('#modal-login'));

function loginUser(event) {
    event.preventDefault();
    const email = loginForm['input-email-login'].value;
    const pwd = loginForm['input-password-login'].value;
    firebase
        .auth()
        .signInWithEmailAndPassword(email, pwd)
        .then(() => {
            loginFeedback.style = `color:green`;
            loginFeedback.innerText = `Login successed.`;
            setTimeout(function() {
                loginModal.hide();
            }, 1000);
            loginForm.reset();
            loginFeedback.innerHTML = ``
        })
        .catch((error) => {
            loginFeedback.style = `color:crimson`;
            loginFeedback.innerText = `${error.message}`;
            loginForm.reset();
        });
    
}

firebase.auth().onAuthStateChanged((user) => {
    console.log('User: ', user)
    setupUI(user)
})