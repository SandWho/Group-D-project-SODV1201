let currentUser = JSON.parse(sessionStorage.getItem("user"));

if (!currentUser) {
  window.location.href = "../index.html";
}

// Populate fields with current user data
$("#profile-email").val(currentUser.email);
$("#profile-username").val(currentUser.username);
$("#profile-phone").val(currentUser.phone);

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

async function updateProfile() {
  const usernameInput = $("#profile-username").val().trim();
  const phoneInput = $("#profile-phone").val().trim();
  const emailInput = $("#profile-email").val().trim().toLowerCase();
  const message = $("#update-message");

  if (!usernameInput || !/^[0-9]{10,15}$/.test(phoneInput) || !isValidEmail(emailInput)) {
    return message.text("All fields must be valid!").css("color", "#ff4d4d");
  }

  try {
    const res = await fetch(`/api/profile/${currentUser.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput,
        phone: phoneInput,
        email: emailInput
      })
    });

    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem("user", JSON.stringify(data.data));
      message.text("Profile updated! Redirecting...").css("color", "#28a745");

      setTimeout(() => {
        const role = data.data.role;
        window.location.href = `${role}.html`; // renter.html or owner.html
      }, 1500);
    } else {
      message.text(data.message).css("color", "#ff4d4d");
    }
  } catch (err) {
    console.error("Update failed:", err);
    message.text("Something went wrong...").css("color", "#ff4d4d");
  }
}
