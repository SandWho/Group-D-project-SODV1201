let listings = [];
let editMode = false;
let editingId = null;

function logout() {
  if (confirm("Are you sure you want to log out?")) {
    sessionStorage.clear();
    window.location.href = "../index.html";
  }
}

function toggleFormVisibility() {
  $("#form-section").css("display", (_, val) => val === "none" ? "flex" : "none");
}

function toggleDropdown() {
  $("#profileDropdown").css("display", (_, val) => val === "flex" ? "none" : "flex");
}

async function loadListings() {
  const res = await fetch("/api/listings");
  const data = await res.json();
  if (data.success) {
    listings = data.data;
    renderListings();
  }
}

async function submitForm() {
  const formValues = {
    name: $("#listing-name").val().trim(),
    address: $("#listing-address").val().trim(),
    area: parseInt($("#listing-area").val()),
    type: $("#listing-type").val().trim(),
    capacity: parseInt($("#listing-capacity").val()),
    parking: $("#listing-parking").val(),
    publicTransport: $("#listing-public-transport").val(),
    availability: $("#listing-availability").val(),
    rentalTerm: $("#listing-term").val(),
    price: parseInt($("#listing-price").val()),
    ownerEmail: JSON.parse(sessionStorage.getItem("user")).email,
    ownerPhone: JSON.parse(sessionStorage.getItem("user")).phone
  };

  const message = $("#form-message");
  const area = parseInt($("#listing-area").val());
  const capacity = parseInt($("#listing-capacity").val());
  const price = parseInt($("#listing-price").val());

  if (
    !formValues.name ||
    !formValues.address ||
    isNaN(area) ||
    !formValues.type ||
    isNaN(capacity) ||
    !formValues.parking ||
    !formValues.publicTransport ||
    !formValues.availability ||
    !formValues.rentalTerm ||
    isNaN(price)
  ) {
    return message.text("All fields must be filled and valid!").css("color", "#ff4d4d");
  }

  try {
    const url = editMode ? `/api/listings/${editingId}` : "/api/listings";
    const method = editMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues)
    });

    const data = await res.json();
    if (data.success) {
      message.text(data.message).css("color", "#28a745");
      clearForm();
      loadListings();
    } else {
      message.text(data.message).css("color", "#ff4d4d");
    }
  } catch (err) {
    message.text("Something went wrong.").css("color", "#ff4d4d");
  }
}

function editListing(id) {
  const l = listings.find(item => item.id === id);
  if (!l) return;

  $("#listing-name").val(l.name);
  $("#listing-address").val(l.address);
  $("#listing-area").val(l.area);
  $("#listing-type").val(l.type);
  $("#listing-capacity").val(l.capacity);
  $("#listing-parking").val(l.parking);
  $("#listing-public-transport").val(l.publicTransport);
  $("#listing-availability").val(l.availability);
  $("#listing-term").val(l.rentalTerm);
  $("#listing-price").val(l.price);

  $("#form-button").text("Save Changes");
  $("#form-title").text("Edit Listing");

  editMode = true;
  editingId = id;

  $("#form-section").css("display", "flex");
}

async function removeListing(id) {
  await fetch(`/api/listings/${id}`, { method: "DELETE" });
  loadListings();
}

function toggleDetails(button) {
  const details = $(button).next(".details");
  const isVisible = details.css("display") === "block";
  details.css("display", isVisible ? "none" : "block");
  $(button).text(isVisible ? "Show More" : "Show Less");
}

function renderListings() {
  const container = $("#listings-container").empty();

  if (!listings.length) return container.html("<p>No listings yet.</p>");

  listings.forEach(l => {
    const div = $(`
      <div class="listing">
        <div class="listing-info">
          <h3>${l.name}</h3>
          <p><strong>$${l.price} / ${l.rentalTerm}</strong></p>
          <button class="show-details-btn">Show More</button>
          <div class="details" style="display: none;">
            <p>Address: ${l.address}</p>
            <p>Area: ${l.area} m²</p>
            <p>Type: ${l.type}</p>
            <p>Capacity: ${l.capacity} people</p>
            <p>Parking: ${l.parking}</p>
            <p>Public Transport: ${l.publicTransport}</p>
            <p>Available: ${l.availability}</p>
            <hr>
            <p><strong>Owner Email:</strong> ${l.ownerEmail}</p>
            <p><strong>Owner Phone:</strong> ${l.ownerPhone}</p>
          </div>
        </div>
        <div class="listing-actions">
          <button class="edit-btn">Edit</button>
          <button class="remove-btn">Remove</button>
        </div>
      </div>
    `);

    div.find(".show-details-btn").click(() => toggleDetails(event.target));
    div.find(".edit-btn").click(() => editListing(l.id));
    div.find(".remove-btn").click(() => removeListing(l.id));
    container.append(div);
  });
}

function clearForm() {
  $("#form-section input, #form-section textarea").val("");
  $("#form-button").text("Add Listing");
  $("#form-title").text("Add New Listing");
  editMode = false;
  editingId = null;
}

function toggleOwnerSearch() {
  const searchSection = $("#ownerSearchSection");
  const isVisible = searchSection.css("display") === "flex" || searchSection.css("display") === "block";
  searchSection.css("display", isVisible ? "none" : "block");
}

function applyOwnerSearch() {
  const query = $("#ownerSearchInput").val().toLowerCase();
  $(".listing").each(function () {
    const $listing = $(this);
    const title = $listing.find("h3").text().toLowerCase();
    const address = $listing.find(".details p:contains('Address')").text().toLowerCase();

    const matches = title.includes(query) || address.includes(query);
    $listing.css("display", matches ? "flex" : "none");
  });
}

$(document).ready(loadListings);
