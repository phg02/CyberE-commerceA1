var eyebtn = document.getElementById("eye-password");
var passwordInput = document.querySelector("#password");

eyebtn.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyebtn.classList.remove("ri-eye-off-line");
    eyebtn.classList.add("ri-eye-line");
  } else {
    passwordInput.type = "password";
    eyebtn.classList.remove("ri-eye-line");
    eyebtn.classList.add("ri-eye-off-line");
  }
});


var eyebtn1 = document.getElementById("eye-confirm-password");
var confirmPasswordInput = document.querySelector("#confirm-password");

eyebtn1.addEventListener("click", function () {
  if (confirmPasswordInput.type === "password") {
    confirmPasswordInput.type = "text";
    eyebtn1.classList.remove("ri-eye-off-line");
    eyebtn1.classList.add("ri-eye-line");
  } else {
    confirmPasswordInput.type = "password";
    eyebtn1.classList.remove("ri-eye-line");
    eyebtn1.classList.add("ri-eye-off-line");
  }
});


const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    //documents
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const confirmPassword = document.querySelector('#confirm-password');

    //regrex
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/;
    const numbers = /[0-9]/;
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;


    let error = false;
    const regrex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let errorList = '';

    if (email.value === '' || email.value == null) {
        error = true;
        errorList += '<li>Email is required</li>';

    }
    if (regrex.test(email.value) === false) {
        error = true;
        errorList += '<li>Email is invalid</li>';
    }
    if (password.value === '' || password.value == null) {
        error = true;
        errorList += '<li>Please enter a password</li>';

    }
    if (password.value.length < 8) {
        error = true;
        errorList += '<li>Password must be at least 8 character</li>';

    }
    if (!lowerCaseLetters.test(password.value)) {
        error = true;
        errorList += '<li>Password must contain a lowercase letter</li>';

    }

    if (!upperCaseLetters.test(password.value)) {
        error = true;
        errorList += '<li>Password must contain a uppercase letter</li>';

    }
    if (!numbers.test(password.value)) {
        error = true;
        errorList += '<li>Password must contain a number letter</li>';
    }

    if (!specialCharacters.test(password.value)) {
        error = true;
        errorList += '<li>Password must contain a special character</li>';

    }
    if (password.value !== confirmPassword.value) {
        error = true;
        errorList += '<li>Password not match</li>';
    }
    if (grecaptcha.getResponse().length <= 0) {
        error = true;
        errorList += '<li>Please complete the captcha</li>';
    }


    let errors = "<ul class='error-list'>" + errorList + "</ul>";
    if (error == true) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            html: errors
        });
        return
    }
    form.submit();
})