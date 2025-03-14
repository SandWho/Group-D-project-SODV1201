let currentUser = {
    username: "john_doe",
    phone: "1234567890",
    email: "john@example.com"
  };
  
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  function updateProfile() {
    const usernameInput = $("#profile-username").val().trim();
    const phoneInput = $("#profile-phone").val().trim();
    const emailInput = $("#profile-email").val().trim().toLowerCase();
    const $message = $("#update-message");
  
    if (!usernameInput) {
      $message.text("Username cannot be empty!").css("color", "#ff4d4d");
      return;
    }
  
    if (!/^[0-9]{10,15}$/.test(phoneInput)) {
      $message.text("Invalid phone number format (digits only, 10-15 characters)!").css("color", "#ff4d4d");
      return;
    }
  
    if (!isValidEmail(emailInput)) {
      $message.text("Invalid email format!").css("color", "#ff4d4d");
      return;
    }
  
    currentUser.username = usernameInput;
    currentUser.phone = phoneInput;
    currentUser.email = emailInput;
  
    $message.text("Profile updated successfully! Please re-log in.").css("color", "#28a745");
  
    setTimeout(() => {
      sessionStorage.clear(); // Optional if you store session data
      window.location.href = "../index.html";
    }, 3000);
  }
  
  $(document).ready(() => {
    // Pre-fill the fields with the user's data
    $("#profile-email").val(currentUser.email);
    $("#profile-username").val(currentUser.username);
    $("#profile-phone").val(currentUser.phone);
  
    $("button").first().on("click", updateProfile);
  });
  