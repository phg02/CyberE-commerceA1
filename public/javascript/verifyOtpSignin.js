const form = document.querySelector("form");
const otpInput = document.querySelector("#otp");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  const otp = otpInput.value.trim();
  if (otp === "") {
    alert("OTP is required");
    return;
  }

  try {
    const response = await fetch("/verification/verify-signin-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verificationCode:otp }),
    });

    const result = await response.text();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result,
      }).then(() => {
        window.location.href = "/homepage";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result,
      });
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
});
