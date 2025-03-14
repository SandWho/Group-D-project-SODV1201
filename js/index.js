let isSignup = false;

let users = {
  "johndoe": {
    email: "john@example.com",
    role: "renter",
    phone: "1234567890"
  },
  "janedoe": {
    email: "jane@example.com",
    role: "owner",
    phone: "0987654321"
  }
};

// Toggle between Login and Sign Up
function toggleForm() {
  isSignup = !isSignup;

  $("#form-title").text(isSignup ? "Sign Up" : "Login");
  $("#username, #role, #phone").toggle(isSignup);
  $("#email").attr("placeholder", isSignup ? "Email" : "Enter your email to login");

  $("button").first().text(isSignup ? "Sign Up" : "Login");

  $(".switch").text(isSignup ? "Already have an account? Login" : "Don't have an account? Sign up");

  $("#message").text("");
}

// Email validation
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Phone validation
function isValidPhone(phone) {
  const phonePattern = /^[0-9]{10,15}$/;
  return phonePattern.test(phone);
}

function submitForm() {
  const username = $("#username").val().trim().toLowerCase();
  const email = $("#email").val().trim().toLowerCase();
  const phone = $("#phone").val().trim();
  const role = $("#role").val();
  const $message = $("#message");

  if (!isValidEmail(email)) {
    $message.text("Invalid email format").css("color", "#ff4d4d");
    return;
  }

  if (isSignup) {
    if (!username || !email || !role || !phone) {
      $message.text("Username, email, phone number, and role are required").css("color", "#ff4d4d");
      return;
    }

    if (!isValidPhone(phone)) {
      $message.text("Invalid phone number format (digits only, 10-15 characters)").css("color", "#ff4d4d");
      return;
    }

    const emailExists = Object.values(users).some(user => user.email === email);
    if (emailExists) {
      $message.text("Email already registered").css("color", "#ff4d4d");
      return;
    }

    users[username] = { email, role, phone };

    $message.text("Signup successful! You can now login.").css("color", "#28a745");

    toggleForm();
  } else {
    const existingUser = Object.values(users).find(user => user.email === email);

    if (!existingUser) {
      $message.text("Invalid email").css("color", "#ff4d4d");
      return;
    }

    $message.text("Login successful! Redirecting...").css("color", "#28a745");

    setTimeout(() => {
      if (existingUser.role === "renter") {
        window.location.href = "html/renter.html";
      } else if (existingUser.role === "owner") {
        window.location.href = "html/owner.html";
      }
    }, 1000);
  }
}

$(document).ready(() => {
  $(".switch").on("click", toggleForm);
  $("button").first().on("click", submitForm);
});
