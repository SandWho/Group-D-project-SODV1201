let isSignup = false;

function toggleForm() {
  isSignup = !isSignup;

  $("#form-title").text(isSignup ? "Sign Up" : "Login");
  $("#username, #role, #phone").css("display", isSignup ? "block" : "none");
  $("#email").attr("placeholder", isSignup ? "Email" : "Enter your email to login");
  $("button[type='submit']").text(isSignup ? "Sign Up" : "Login");
  $(".switch").text(isSignup ? "Already have an account? Login" : "Don't have an account? Sign up");
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

async function submitForm() {
  const username = $("#username").val().trim();
  const email = $("#email").val().trim().toLowerCase();
  const phone = $("#phone").val().trim();
  const role = $("#role").val();
  const message = $("#message");

  if (!isValidEmail(email)) {
    return message.text("Invalid email format").css("color", "#ff4d4d");
  }

  if (isSignup) {
    if (!username || !email || !phone || !role) {
      return message.text("All fields are required").css("color", "#ff4d4d");
    }

    if (!isValidPhone(phone)) {
      return message.text("Phone number must be 10-15 digits").css("color", "#ff4d4d");
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phone, role })
      });

      const data = await res.json();
      if (data.success) {
        message.css("color", "#28a745").text(data.message);
        toggleForm();
      } else {
        message.css("color", "#ff4d4d").text(data.message);
      }
    } catch (err) {
      message.text("Server error. Try again later.").css("color", "#ff4d4d");
    }

  } else {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("user", JSON.stringify(data.data));
        message.css("color", "#28a745").text("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = `html/${data.data.role}.html`;
        }, 1000);
      } else {
        message.css("color", "#ff4d4d").text(data.message);
      }
    } catch (err) {
      message.text("Server error. Try again later.").css("color", "#ff4d4d");
    }
  }
}
