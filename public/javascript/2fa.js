const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  try {
    const verificationCode = document.querySelector("#twoFAcode").value;
    const verify2FA = await fetch("/verification/2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ twoFACode: verificationCode }),
    });
    const result = await verify2FA.text();
    if (verify2FA.ok) {
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
  } catch (err) {
    console.error("Submission error:", err);
    Swal.fire({
      icon: "error",
      title: "Submission failed",
      text: "Something went wrong. Please try again.",
    });
  }
});
