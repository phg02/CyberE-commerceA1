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

  const form = document.querySelector("form");
  form.addEventListener("submit", function () {
    if (rememberCheckbox.checked) {
      localStorage.setItem("rememberedEmail", emailInput.value);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  });
});


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  let error = false;
  let errorList = "";

  if (email.value === "" || email.value == null) {
    error = true;
    errorList += "<li>Email is required</li>";
  }

  if (password.value === "" || password.value == null) {
    error = true;
    errorList += "<li>Password is required</li>";
  }

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      html: `<ul>${errorList}</ul>`,
    });
    return;
  }

  const response = await fetch("/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value.trim(), password: password.value.trim() }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorText,
    });
    return;
  }
  const result = await response.text();
  Swal.fire({
    icon: "success",
    title: "Success",
    text: result,
  }).then(() => {
    window.location.href = "/homepage";
  });
});
