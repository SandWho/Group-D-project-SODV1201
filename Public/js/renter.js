let listings = [];

function logout() {
  if (confirm("Are you sure you want to log out?")) {
    sessionStorage.clear();
    window.location.href = "../index.html";
  }
}

function toggleDropdown() {
  $("#profileDropdown").css("display", (_, val) => val === "flex" ? "none" : "flex");
}

function toggleFilter() {
  $("#filterSection").css("display", (_, val) => val === "flex" ? "none" : "flex");
}

function toggleSearch() {
  $("#searchSection").css("display", (_, val) => val === "flex" ? "none" : "flex");
}

function toggleDetails(button) {
  const details = $(button).next(".details");
  const isVisible = details.css("display") === "block";
  details.css("display", isVisible ? "none" : "block");
  $(button).text(isVisible ? "Show Details" : "Hide Details");
}

async function loadListings() {
  try {
    const res = await fetch("/api/listings");
    const data = await res.json();
    if (data.success) {
      listings = data.data;
      renderListings();
    }
  } catch (err) {
    console.error("Failed to fetch listings.");
  }
}

function renderListings() {
  const container = $("#listings-container").empty();

  if (listings.length === 0) {
    return container.html("<p>No listings available.</p>");
  }

  listings.forEach(listing => {
    const listingDiv = $(`
      <div class="listing"
           data-area="${listing.area}"
           data-parking="${listing.parking}"
           data-publictransport="${listing.publicTransport}"
           data-available="${listing.availability}"
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
            <p>Available: ${listing.availability}</p>
            <hr>
            <p><strong>Owner Email:</strong> ${listing.ownerEmail}</p>
            <p><strong>Owner Phone:</strong> ${listing.ownerPhone}</p>
          </div>
        </div>
      </div>
    `);

    listingDiv.find(".show-details-btn").click(function () {
      toggleDetails(this);
    });

    container.append(listingDiv);
  });
}

function applyFiltersAndSort() {
  const minArea = parseInt($("#areaMin").val());
  const maxArea = parseInt($("#areaMax").val());
  const minCapacity = parseInt($("#capacityFilter").val());
  const parkingVal = $("#parkingFilter").val().toLowerCase();
  const transportVal = $("#publicTransportFilter").val().toLowerCase();
  const availVal = $("#availabilityFilter").val().toLowerCase();
  const sortOrder = $("#sortPrice").val();
  const query = $("#searchInput").val().toLowerCase();

  let listings = $(".listing");

  listings.each(function () {
    const $listing = $(this);
    const area = parseInt($listing.attr("data-area"));
    const capacity = parseInt($listing.find(".details p:contains('Capacity')").text().match(/\d+/)); // get number from capacity text
    const parking = $listing.attr("data-parking").toLowerCase();
    const transport = $listing.attr("data-publictransport").toLowerCase();
    const available = $listing.attr("data-available").toLowerCase();
    const price = parseInt($listing.attr("data-price"));
    const title = $listing.find("h3").text().toLowerCase();
    const address = $listing.find("p").first().text().toLowerCase();

    let visible = true;

    if (!isNaN(minArea) && area < minArea) visible = false;
    if (!isNaN(maxArea) && area > maxArea) visible = false;
    if (!isNaN(minCapacity) && capacity < minCapacity) visible = false;

    if (parkingVal !== "all" && parking !== parkingVal) visible = false;
    if (transportVal !== "all" && transport !== transportVal) visible = false;
    if (availVal !== "all" && available !== availVal) visible = false;

    if (query && !title.includes(query) && !address.includes(query)) visible = false;

    $listing.css("display", visible ? "flex" : "none");
  });

  const visibleListings = $(".listing:visible");

  if (sortOrder !== "none") {
    visibleListings.sort((a, b) => {
      const priceA = parseInt($(a).attr("data-price"));
      const priceB = parseInt($(b).attr("data-price"));
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });

    const container = $("#listings-container");
    container.append(visibleListings);
  }
}


$(document).ready(loadListings);
