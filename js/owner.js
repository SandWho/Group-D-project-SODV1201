let listings = [
  {
    id: Date.now(), // unique-ish id
    name: "Downtown Recording Studio",
    address: "123 Main Street, Vancouver, BC V5K 0A1",
    area: 75,
    type: "Recording Studio",
    capacity: 10,
    parking: "Yes",
    publicTransport: "Yes",
    availability: "Yes",
    rentalTerm: "Hourly",
    price: 100,
    ownerEmail: "owner@example.com",
    ownerPhone: "1234567890"
  },
  {
    id: Date.now() + 1,
    name: "Urban Dance Studio",
    address: "456 Dance Ave, Toronto, ON M5V 2T6",
    area: 150,
    type: "Dance Studio",
    capacity: 20,
    parking: "No",
    publicTransport: "Yes",
    availability: "Yes",
    rentalTerm: "Daily",
    price: 250,
    ownerEmail: "owner@example.com",
    ownerPhone: "1234567890"
  },
  {
    id: Date.now() + 2,
    name: "Photography Loft",
    address: "789 Photo Blvd, Montreal, QC H3B 1X8",
    area: 60,
    type: "Photography Studio",
    capacity: 5,
    parking: "Yes",
    publicTransport: "No",
    availability: "No",
    rentalTerm: "Hourly",
    price: 75,
    ownerEmail: "owner@example.com",
    ownerPhone: "1234567890"
  },
  {
    id: Date.now() + 4,
    name: "Yoga Retreat Space",
    address: "222 Zen Lane, Victoria, BC V8W 1N6",
    area: 200,
    type: "Yoga Studio",
    capacity: 25,
    parking: "Yes",
    publicTransport: "No",
    availability: "Yes",
    rentalTerm: "Weekly",
    price: 600,
    ownerEmail: "owner@example.com",
    ownerPhone: "1234567890"
  },
  {
    id: Date.now() + 5,
    name: "Craft Maker’s Hub",
    address: "555 Maker Rd, Edmonton, AB T5J 3N5",
    area: 80,
    type: "Workshop Space",
    capacity: 12,
    parking: "No",
    publicTransport: "Yes",
    availability: "No",
    rentalTerm: "Monthly",
    price: 1500,
    ownerEmail: "owner@example.com",
    ownerPhone: "1234567890"
  }
];

function renderListings() {
  const $container = $("#listings-container");
  $container.empty();

  if (listings.length === 0) {
    $container.html("<p>No listings yet.</p>");
    return;
  }

  $.each(listings, function (index, listing) {
    const $listingDiv = $(`
      <div class="listing">
        <div class="listing-info">
          <h3>${listing.name}</h3>
          <p><strong>$${listing.price} / ${listing.rentalTerm}</strong></p>
          <button class="show-details-btn">Show More</button>
          <div class="details" style="display: none; margin-top: 10px;">
            <p>Address: ${listing.address}</p>
            <p>Area: ${listing.area} m²</p>
            <p>Type: ${listing.type}</p>
            <p>Capacity: ${listing.capacity} people</p>
            <p>Parking: ${listing.parking}</p>
            <p>Public Transport: ${listing.publicTransport}</p>
            <p>Available: ${listing.availability}</p>
            <hr>
            <p><strong>Owner Email:</strong> <a href="mailto:${listing.ownerEmail}">${listing.ownerEmail}</a></p>
            <p><strong>Owner Phone:</strong> <a href="tel:${listing.ownerPhone}">${listing.ownerPhone}</a></p>
          </div>
        </div>
        <div class="listing-actions">
          <button class="edit-btn">Edit</button>
          <button class="remove-btn">Remove</button>
        </div>
      </div>
    `);

    $container.append($listingDiv);
  });
}

function submitForm() {
  const name = $("#listing-name").val().trim();
  const address = $("#listing-address").val().trim();
  const area = $("#listing-area").val().trim();
  const type = $("#listing-type").val().trim();
  const capacity = $("#listing-capacity").val().trim();
  const parking = $("#listing-parking").val();
  const publicTransport = $("#listing-public-transport").val();
  const availability = $("#listing-availability").val();
  const rentalTerm = $("#listing-term").val();
  const price = $("#listing-price").val().trim();
  const message = $("#form-message");

  if (!name || !address || !area || !type || !capacity || !parking || !publicTransport || !availability || !rentalTerm || !price) {
    message.text("All fields are required!").css("color", "#ff4d4d");
    return;
  }

  const listing = {
    id: Date.now(),
    name,
    address,
    area,
    type,
    capacity,
    parking,
    publicTransport,
    availability,
    rentalTerm,
    price,
    ownerEmail: "owner@example.com",
    ownerPhone: "000-000-0000"
  };

  listings.push(listing);
  message.text("Listing added successfully!").css("color", "#28a745");
  clearForm();
  renderListings();
}

function toggleDetails($button) {
  const $details = $button.next(".details");
  const isVisible = $details.is(":visible");

  $details.toggle();
  $button.text(isVisible ? "Show More" : "Show Less");
}

function logout() {
  if (confirm("Are you sure you want to log out?")) {
    window.location.href = "../index.html";
  }
}

function clearForm() {
  $("#listing-name, #listing-address, #listing-area, #listing-type, #listing-capacity, #listing-parking, #listing-public-transport, #listing-availability, #listing-term, #listing-price").val("");
}

$(document).ready(function () {
  renderListings();

  $(document).on("click", ".show-details-btn", function () {
    toggleDetails($(this));
  });

  $(document).on("click", ".edit-btn", function () {
    alert("Edit functionality not implemented yet!");
  });

  $(document).on("click", ".remove-btn", function () {
    const index = $(this).closest(".listing").index();
    listings.splice(index, 1);
    renderListings();
  });

  $("#form-button").on("click", submitForm);
  $(".profile-menu").on("click", toggleDropdown);
});
