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
  },
  "mikesmith": {
    email: "mike@example.com",
    role: "renter",
    phone: "5556667777"
  },
  "emilywong": {
    email: "emily@example.com",
    role: "owner",
    phone: "2223334444"
  }
};

function toggleForm() {
  isSignup = !isSignup;

  $("#form-title").text(isSignup ? "Sign Up" : "Login");
  $("#username").css("display", isSignup ? "block" : "none");
  $("#role").css("display", isSignup ? "block" : "none");
  $("#phone").css("display", isSignup ? "block" : "none");
  $("#email").attr("placeholder", isSignup ? "Email" : "Enter your email to login");
  $("button[type='submit']").text(isSignup ? "Sign Up" : "Login");
  $(".switch").text(isSignup
    ? "Already have an account? Login"
    : "Don't have an account? Sign up"
  );
  $("#message").text("");
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhone(phone) {
  const phonePattern = /^[0-9]{10,15}$/;
  return phonePattern.test(phone);
}

function submitForm() {
  const username = $("#username").val().trim().toLowerCase();
  const email = $("#email").val().trim().toLowerCase();
  const phone = $("#phone").val().trim();
  const role = $("#role").val();
  const message = $("#message");

  if (!isValidEmail(email)) {
    message.text("Invalid email format").css("color", "#ff4d4d");
    return;
  }

  if (isSignup) {
    if (!username || !email || !role || !phone) {
      message.text("Username, email, phone number, and role are required").css("color", "#ff4d4d");
      return;
    }

    if (!isValidPhone(phone)) {
      message.text("Invalid phone number format (digits only, 10-15 characters)").css("color", "#ff4d4d");
      return;
    }

    if (Object.values(users).some(user => user.email === email)) {
      message.text("Email already registered").css("color", "#ff4d4d");
      return;
    }

    users[username] = { email, role, phone };
    message.css("color", "#28a745").text("Signup successful! You can now login.");

    toggleForm();
  } else {
    const existingUser = Object.values(users).find(user => user.email === email);

    if (!existingUser) {
      message.text("Invalid email").css("color", "#ff4d4d");
      return;
    }

    message.css("color", "#28a745").text("Login successful! Redirecting...");

    setTimeout(() => {
      if (existingUser.role === "renter") {
        window.location.href = "html/renter.html";
      } else if (existingUser.role === "owner") {
        window.location.href = "html/owner.html";
      }
    }, 1000);
  }
}
