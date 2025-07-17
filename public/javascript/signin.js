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

document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const rememberCheckbox = document.getElementById("remember");

  // Load saved email from localStorage
  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }

  // On form submit, store or remove email
  const form = document.querySelector("form");
  form.addEventListener("submit", function () {
    if (rememberCheckbox.checked) {
      localStorage.setItem("rememberedEmail", emailInput.value);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  });
});
