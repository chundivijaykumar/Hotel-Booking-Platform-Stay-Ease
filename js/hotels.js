// ============================================================
// STAYEASE - HOTELS.JS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    loadHotelsPage();

});


// ============================================================
// LOAD HOTELS
// ============================================================

function loadHotelsPage() {

    const container =
        document.getElementById("hotelsContainer");

    if (!container) {
        return;
    }

    const hotels = getHotels();

    if (!hotels || hotels.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h2>No Hotels Available</h2>
                <p>Please check again later.</p>
            </div>
        `;

        return;
    }

    displayHotels(hotels);
}


// ============================================================
// DISPLAY HOTELS
// ============================================================

function displayHotels(hotels) {

    const container =
        document.getElementById("hotelsContainer");

    container.innerHTML = hotels.map(hotel => {

        const rating =
            hotel.rating || "4.7";

        const image =
            hotel.image ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945";

        const location =
            hotel.location ||
            `${hotel.city}, India`;

        const manager =
            hotel.manager || {};

        const managerName =
            manager.name || "Hotel Manager";

        const managerPhone =
            manager.phone || "Not Available";

        const lowestPrice =
            getLowestRoomPrice(hotel);

        return `

            <div class="hotel-card">

                <!-- HOTEL IMAGE -->

                <img
                    src="${image}"
                    alt="${hotel.name}"
                    class="hotel-image"
                >


                <div class="hotel-card-content">

                    <!-- HOTEL NAME -->

                    <h2>
                        ${hotel.name}
                    </h2>


                    <!-- LOCATION -->

                    <p class="hotel-location">

                        📍 ${hotel.city}, India

                    </p>


                    <!-- RATING -->

                    <p class="hotel-rating">

                        ⭐ ${rating} / 5

                    </p>


                    <!-- DESCRIPTION -->

                    <p class="hotel-description">

                        ${
                            hotel.description ||
                            "Comfortable hotel with modern facilities."
                        }

                    </p>


                    <!-- MANAGER -->

                    <div class="hotel-manager-preview">

                        <strong>
                            👨‍💼 Manager:
                        </strong>

                        ${managerName}

                        <br>

                        <strong>
                            📞
                        </strong>

                        ${managerPhone}

                    </div>


                    <!-- PRICE -->

                    <div class="hotel-price">

                        Starting from

                        <strong>
                            ₹${lowestPrice.toLocaleString("en-IN")}
                        </strong>

                        / night

                    </div>


                    <!-- VIEW DETAILS -->

                    <button
                        class="view-details-btn"
                        onclick="viewHotelDetails(${hotel.id})"
                    >

                        View Details

                    </button>

                </div>

            </div>

        `;

    }).join("");

}


// ============================================================
// GET LOWEST ROOM PRICE
// ============================================================

function getLowestRoomPrice(hotel) {

    if (
        !hotel.rooms ||
        hotel.rooms.length === 0
    ) {

        return 0;
    }

    const prices =
        hotel.rooms
            .map(room => Number(room.price))
            .filter(price => !isNaN(price));

    if (prices.length === 0) {
        return 0;
    }

    return Math.min(...prices);
}


// ============================================================
// VIEW HOTEL DETAILS
// ============================================================

function viewHotelDetails(hotelId) {

    if (!hotelId) {

        alert("Hotel information not found.");

        return;
    }


    window.location.href =
        "hotel-details.html?id=" +
        encodeURIComponent(hotelId);

}


// ============================================================
// SEARCH HOTELS
// ============================================================

function searchHotels() {

    const searchInput =
        document.getElementById("searchInput");

    const locationFilter =
        document.getElementById("locationFilter");


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedLocation =
        locationFilter
            ? locationFilter.value
                .trim()
                .toLowerCase()
            : "";


    const hotels =
        getHotels();


    const filteredHotels =
        hotels.filter(hotel => {

            const name =
                hotel.name
                    .toLowerCase();

            const city =
                hotel.city
                    .toLowerCase();


            const matchesSearch =
                !searchText ||
                name.includes(searchText) ||
                city.includes(searchText);


            const matchesLocation =
                !selectedLocation ||
                city === selectedLocation;


            return (
                matchesSearch &&
                matchesLocation
            );

        });


    displayHotels(
        filteredHotels
    );

}


// ============================================================
// LOAD LOCATION FILTER
// ============================================================

function loadLocationFilter() {

    const select =
        document.getElementById(
            "locationFilter"
        );


    if (!select) {
        return;
    }


    const hotels =
        getHotels();


    const cities =
        [
            ...new Set(
                hotels.map(
                    hotel => hotel.city
                )
            )
        ];


    select.innerHTML = `

        <option value="">
            All Locations
        </option>

        ${cities.map(
            city => `
                <option value="${city}">
                    ${city}
                </option>
            `
        ).join("")}

    `;

}


// ============================================================
// INITIALIZE SEARCH
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadLocationFilter();

        const searchButton =
            document.getElementById(
                "searchButton"
            );


        const searchInput =
            document.getElementById(
                "searchInput"
            );


        const locationFilter =
            document.getElementById(
                "locationFilter"
            );


        if (searchButton) {

            searchButton.addEventListener(
                "click",
                searchHotels
            );

        }


        if (searchInput) {

            searchInput.addEventListener(
                "keyup",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        searchHotels();

                    }

                }
            );

        }


        if (locationFilter) {

            locationFilter.addEventListener(
                "change",
                searchHotels
            );

        }

    }
);