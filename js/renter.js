let listings = [
  {
    id: Date.now(),
    name: "Downtown Dance Studio",
    address: "123 Main Street, Vancouver, BC V5K 0A1",
    area: 100,
    type: "Dance Studio",
    capacity: 20,
    parking: "No",
    publicTransport: "Yes",
    available: "Yes",
    rentalTerm: "Daily",
    price: 200,
    ownerEmail: "owner@example.com",
    ownerPhone: "1234567890"
  },
  {
    id: Date.now() + 1,
    name: "Bow Valley Recording Studio",
    address: "345 - 6 Avenue SE, Calgary, AB T2G 4V1",
    area: 50,
    type: "Recording Studio",
    capacity: 5,
    parking: "Yes",
    publicTransport: "Yes",
    available: "Yes",
    rentalTerm: "Hourly",
    price: 50,
    ownerEmail: "owner@example.com",
    ownerPhone: "1234567890"
  },
  {
    id: Date.now() + 2,
    name: "Creative Art Workshop",
    address: "321 Paint St, Ottawa, ON K1P 5G4",
    area: 90,
    type: "Art Studio",
    capacity: 15,
    parking: "No",
    publicTransport: "Yes",
    available: "Yes",
    rentalTerm: "Daily",
    price: 120,
    ownerEmail: "owner@example.com",
    ownerPhone: "1234567890"
  },
  {
    id: Date.now() + 3,
    name: "Yoga Retreat Space",
    address: "222 Zen Lane, Victoria, BC V8W 1N6",
    area: 200,
    type: "Yoga Studio",
    capacity: 25,
    parking: "Yes",
    publicTransport: "No",
    available: "Yes",
    rentalTerm: "Weekly",
    price: 600,
    ownerEmail: "owner@example.com",
    ownerPhone: "1234567890"
  },
  {
    id: Date.now() + 4,
    name: "Craft Maker’s Hub",
    address: "555 Maker Rd, Edmonton, AB T5J 3N5",
    area: 80,
    type: "Workshop Space",
    capacity: 12,
    parking: "No",
    publicTransport: "Yes",
    available: "No",
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
    $container.html("<p>No listings available.</p>");
    return;
  }

  $.each(listings, function (index, listing) {
    const $listingDiv = $(`
      <div class="listing" 
           data-area="${listing.area}" 
           data-parking="${listing.parking}" 
           data-publictransport="${listing.publicTransport}" 
           data-available="${listing.available}" 
           data-price="${listing.price}">
        <div class="listing-info">
          <h3>${listing.name}</h3>
          <p>Address: ${listing.address}</p>
          <p><strong>$${listing.price} / ${listing.rentalTerm}</strong></p>
          <button class="show-details-btn">Show Details</button>
          <div class="details" style="display: none;">
            <p>Area: ${listing.area} m²</p>
            <p>Type: ${listing.type}</p>
            <p>Capacity: ${listing.capacity} people</p>
            <p>Parking: ${listing.parking}</p>
            <p>Public Transport: ${listing.publicTransport}</p>
            <p>Available: ${listing.available}</p>
            <hr>
            <p><strong>Owner Email:</strong> <a href="mailto:${listing.ownerEmail}">${listing.ownerEmail}</a></p>
            <p><strong>Owner Phone:</strong> <a href="tel:${listing.ownerPhone}">${listing.ownerPhone}</a></p>
          </div>
        </div>
      </div>
    `);

    $container.append($listingDiv);
  });
}

function toggleDropdown() {
  $("#profileDropdown").toggle();
}

function toggleFilter() {
  $("#filterSection").toggle();
}

function toggleSearch() {
  $("#searchSection").toggle();
}

function toggleDetails($button) {
  const $details = $button.next(".details");
  const isVisible = $details.is(":visible");

  $details.toggle();
  $button.text(isVisible ? "Show Details" : "Hide Details");
}

function applyFiltersAndSort() {
  const areaValue = $("#areaFilter").val();
  const parkingValue = $("#parkingFilter").val();
  const transportValue = $("#publicTransportFilter").val();
  const availabilityValue = $("#availabilityFilter").val();
  const sortOrder = $("#sortPrice").val();
  const searchQuery = $("#searchInput").val().toLowerCase();

  let $listings = $(".listing");

  $listings.each(function () {
    const $listing = $(this);
    const area = parseInt($listing.data("area"));
    const parking = $listing.data("parking");
    const publicTransport = $listing.data("publictransport");
    const available = $listing.data("available");
    const title = $listing.find("h3").text().toLowerCase();
    const address = $listing.find("p:first").text().toLowerCase();

    let show = true;

    if (areaValue !== "all") {
      const [minArea, maxArea] = areaValue.split("-").map(Number);
      if (area < minArea || area > maxArea) show = false;
    }
    if (parkingValue !== "all" && parking !== parkingValue) show = false;
    if (transportValue !== "all" && publicTransport !== transportValue) show = false;
    if (availabilityValue !== "all" && available !== availabilityValue) show = false;
    if (searchQuery && !title.includes(searchQuery) && !address.includes(searchQuery)) show = false;

    $listing.toggle(show);
  });

  let sortedListings = $listings.filter(":visible");

  if (sortOrder !== "none") {
    sortedListings.sort(function (a, b) {
      const priceA = parseInt($(a).data("price"));
      const priceB = parseInt($(b).data("price"));
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });

    const $container = $("#listings-container");
    sortedListings.each(function () {
      $container.append(this);
    });
  }
}

function logout() {
  if (confirm("Are you sure you want to log out?")) {
    window.location.href = "../index.html";
  }
}

$(document).ready(function () {
  renderListings();

  $(document).on("click", ".show-details-btn", function () {
    toggleDetails($(this));
  });

  $(".profile-menu").on("click", toggleDropdown);
  $(".filter-toggle-btn").on("click", toggleFilter);
  $(".search-toggle-btn").on("click", toggleSearch);
  $("#areaFilter, #parkingFilter, #publicTransportFilter, #availabilityFilter, #sortPrice, #searchInput").on("change keyup", applyFiltersAndSort);
});
