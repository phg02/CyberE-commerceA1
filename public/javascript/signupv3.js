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

const form = document.querySelector("form");
console.log("working");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  //documents
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm-password");

  //regrex
  const lowerCaseLetters = /[a-z]/g;
  const upperCaseLetters = /[A-Z]/;
  const numbers = /[0-9]/;
  const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  let error = false;
  const regrex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  let errorList = "";

  if (email.value === "" || email.value == null) {
    error = true;
    errorList += "<li>Email is required</li>";
  }
  if (regrex.test(email.value) === false) {
    error = true;
    errorList += "<li>Email is invalid</li>";
  }
  if (password.value === "" || password.value == null) {
    error = true;
    errorList += "<li>Please enter a password</li>";
  }
  if (password.value.length < 8) {
    error = true;
    errorList += "<li>Password must be at least 8 character</li>";
  }
  if (!lowerCaseLetters.test(password.value)) {
    error = true;
    errorList += "<li>Password must contain a lowercase letter</li>";
  }

  if (!upperCaseLetters.test(password.value)) {
    error = true;
    errorList += "<li>Password must contain a uppercase letter</li>";
  }
  if (!numbers.test(password.value)) {
    error = true;
    errorList += "<li>Password must contain a number letter</li>";
  }

  if (!specialCharacters.test(password.value)) {
    error = true;
    errorList += "<li>Password must contain a special character</li>";
  }
  if (password.value !== confirmPassword.value) {
    error = true;
    errorList += "<li>Password not match</li>";
  }

  let errors = "<ul class='error-list'>" + errorList + "</ul>";
  if (error == true) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      html: errors,
    });
    return;
  }
  console.log("Form submitted successfully");
  try {
    const token = await grecaptcha.execute(
      "6LfRNYgrAAAAAJHAaJyaSNkcdWAmpFQlipk2XpDS",
      { action: "submit" }
    );

    const response = await fetch("/signup/captchav3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value,
        password_confirm: confirmPassword.value,
        "g-recaptcha-response": token,
      }),
    });

    const result = await response.text();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result,
      }).then(async () => {
        const verifyResponse = await fetch("/verification/verify-email-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.value.trim() }),
        });
        const verifyResult = await verifyResponse.text();
        if (verifyResponse.ok) {
          Swal.fire({
            icon: "info",
            title: "Verification Code Sent",
            text: verifyResult,
          }).then(() => {
            window.location.href =
              "/verification/verify-email-otp?email=" + email.value.trim();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: verifyResult,
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result,
      });
    }
  } catch (err) {
    console.error("Submission error:", err);
    Swal.fire({
      icon: "error",
      title: "Submission failed",
      text: "Something went wrong. Please try again.",
    });
  }
});
