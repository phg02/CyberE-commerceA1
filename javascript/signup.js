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
