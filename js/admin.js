/* =========================================================
   STAYEASE ADMIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   ADMIN ACCOUNTS
   ========================================================= */

const ADMIN_ACCOUNTS = [

    {
        name: "StayEase Administrator",
        email: "admin@stayease.in",
        password: "admin123",
        role: "Hotel Platform Administrator"
    },

    {
        name: "Vijay Kumar",
        email: "vijay.admin@stayease.in",
        password: "vijay123",
        role: "Hotel Manager"
    },

    {
        name: "Anjali Reddy",
        email: "anjali.admin@stayease.in",
        password: "anjali123",
        role: "Hotel Manager"
    }

];


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatCurrency(amount) {

    return "₹" + Number(amount || 0).toLocaleString("en-IN");

}


function getToday() {

    const date = new Date();

    return date.toISOString().split("T")[0];

}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

function adminLogin(event) {

    event.preventDefault();

    const emailElement = document.getElementById("adminEmail");
    const passwordElement = document.getElementById("adminPassword");

    if (!emailElement || !passwordElement) {
        return;
    }

    const email = emailElement.value.trim();
    const password = passwordElement.value.trim();

    const admin = ADMIN_ACCOUNTS.find(function (item) {

        return (
            item.email.toLowerCase() === email.toLowerCase() &&
            item.password === password
        );

    });


    const message = document.getElementById("adminLoginMessage");


    if (!admin) {

        if (message) {

            message.textContent = "Invalid admin email or password.";
            message.style.color = "#dc2626";

        }

        return;

    }


    localStorage.setItem(
        "currentAdmin",
        JSON.stringify(admin)
    );


    window.location.href = "dashboard.html";

}


/* =========================================================
   ADMIN LOGOUT
   ========================================================= */

function adminLogout() {

    localStorage.removeItem("currentAdmin");

    window.location.href = "login.html";

}


/* =========================================================
   CHECK ADMIN LOGIN
   ========================================================= */

function checkAdminLogin() {

    const currentAdmin = JSON.parse(
        localStorage.getItem("currentAdmin")
    );


    const currentPage =
        window.location.pathname.toLowerCase();


    if (
        currentPage.includes("/admin/dashboard.html") &&
        !currentAdmin
    ) {

        window.location.href = "login.html";

        return false;

    }


    return true;

}


/* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) {
        return;
    }


    if (input.type === "password") {

        input.type = "text";

        if (button) {
            button.textContent = "🙈";
        }

    } else {

        input.type = "password";

        if (button) {
            button.textContent = "👁";
        }

    }

}


/* =========================================================
   HOTEL FUNCTIONS
   ========================================================= */

function getAdminHotels() {

    if (typeof getHotels === "function") {

        return getHotels();

    }


    const hotels = JSON.parse(
        localStorage.getItem("hotels") || "[]"
    );

    return Array.isArray(hotels) ? hotels : [];

}


function saveAdminHotels(hotels) {

    if (typeof saveHotels === "function") {

        saveHotels(hotels);

        return;

    }


    localStorage.setItem(
        "hotels",
        JSON.stringify(hotels)
    );

}


/* =========================================================
   NORMALIZE HOTEL MANAGER DETAILS
   ========================================================= */

function normalizeHotelManager(hotel) {

    if (!hotel.manager) {

        hotel.manager = {

            name: "Hotel Manager",
            phone: "Not Available",
            email: "Not Available"

        };

    }


    if (!hotel.location) {

        hotel.location =
            hotel.city ?
            hotel.city + ", India" :
            "India";

    }


    if (!hotel.locationLink) {

        hotel.locationLink =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(
                (hotel.name || "") +
                " " +
                (hotel.city || "")
            );

    }


    return hotel;

}


/* =========================================================
   USER ID UPDATE
   ========================================================= */

function updateUserIds() {

    const users = JSON.parse(
        localStorage.getItem("users") || "[]"
    );


    if (!Array.isArray(users)) {
        return;
    }


    let nextId = 50001;


    users.forEach(function (user) {

        const numericId = Number(user.id);


        if (
            !numericId ||
            numericId < 50001 ||
            numericId > 999999
        ) {

            user.id = nextId;

            nextId++;

        }

    });


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


/* =========================================================
   BOOKING ID UPDATE
   ========================================================= */

function updateBookingIds() {

    const bookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
    );


    if (!Array.isArray(bookings)) {
        return;
    }


    let nextId = 1001;


    bookings.forEach(function (booking) {

        const numericId = Number(
            booking.id ||
            booking.bookingId ||
            booking.bookingID
        );


        if (
            !numericId ||
            numericId < 1000 ||
            numericId > 9999
        ) {

            while (
                bookings.some(function (item) {
                    return Number(item.id) === nextId;
                })
            ) {

                nextId++;

            }


            booking.id = nextId;

            nextId++;

        } else {

            booking.id = numericId;

        }

    });


    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );

}


/* =========================================================
   BOOKING FUNCTIONS
   ========================================================= */

function getAdminBookings() {

    const bookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
    );


    return Array.isArray(bookings)
        ? bookings
        : [];

}


function saveAdminBookings(bookings) {

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );

}


/* =========================================================
   UPDATE COMPLETED BOOKINGS
   ========================================================= */

function updateCompletedBookings() {

    const bookings = getAdminBookings();

    const today = getToday();

    let changed = false;


    bookings.forEach(function (booking) {

        const checkout =
            booking.checkOut ||
            booking.checkout;


        const paymentStatus =
            String(
                booking.paymentStatus || ""
            ).toLowerCase();


        const currentStatus =
            String(
                booking.status || ""
            ).toLowerCase();


        const isCancelled =
            currentStatus.includes("cancelled");


        const isPaid =
            paymentStatus === "paid" ||
            currentStatus === "confirmed" ||
            currentStatus === "completed";


        if (
            checkout &&
            checkout <= today &&
            isPaid &&
            !isCancelled &&
            currentStatus !== "completed"
        ) {

            booking.status = "Completed";

            booking.completedAt =
                new Date().toISOString();

            changed = true;

        }

    });


    if (changed) {

        saveAdminBookings(bookings);

    }

}


/* =========================================================
   GET COMPLETED BOOKINGS
   ========================================================= */

function getCompletedBookings() {

    updateCompletedBookings();

    const bookings = getAdminBookings();


    return bookings.filter(function (booking) {

        return String(
            booking.status || ""
        ).toLowerCase() === "completed";

    });

}


/* =========================================================
   COMPLETED REVENUE
   ========================================================= */

function getCompletedRevenue() {

    const completedBookings =
        getCompletedBookings();


    return completedBookings.reduce(
        function (total, booking) {

            return total +
                Number(
                    booking.total ||
                    booking.totalAmount ||
                    booking.amount ||
                    0
                );

        },
        0
    );

}


/* =========================================================
   BOOKING DISPLAY HELPERS
   ========================================================= */

function getBookingId(booking) {

    return (
        booking.id ||
        booking.bookingId ||
        booking.bookingID ||
        "-"
    );

}


function getUserId(booking) {

    return (
        booking.userId ||
        booking.userID ||
        "-"
    );

}


function getUserName(booking) {

    return (
        booking.userName ||
        booking.name ||
        booking.user ||
        "-"
    );

}


function getHotelName(booking) {

    return (
        booking.hotelName ||
        booking.hotel ||
        "-"
    );

}


function getCity(booking) {

    return (
        booking.city ||
        "-"
    );

}


function getRoomType(booking) {

    return (
        booking.roomType ||
        booking.room ||
        "-"
    );

}


function getPersons(booking) {

    return (
        booking.persons ||
        booking.guests ||
        booking.numberOfGuests ||
        "-"
    );

}


function getAcType(booking) {

    return (
        booking.acType ||
        booking.ac ||
        "-"
    );

}


function getCheckIn(booking) {

    return (
        booking.checkIn ||
        "-"
    );

}


function getCheckOut(booking) {

    return (
        booking.checkOut ||
        booking.checkout ||
        "-"
    );

}


function getBookingAmount(booking) {

    return Number(
        booking.total ||
        booking.totalAmount ||
        booking.amount ||
        0
    );

}


/* =========================================================
   STATUS HTML
   ========================================================= */

function getStatusHTML(status) {

    const value =
        String(status || "Pending");


    const lower =
        value.toLowerCase();


    if (lower.includes("completed")) {

        return `
            <span class="status-badge status-completed">
                Completed
            </span>
        `;

    }


    if (lower.includes("cancelled")) {

        return `
            <span class="status-badge status-cancelled">
                ${escapeHTML(value)}
            </span>
        `;

    }


    if (lower.includes("confirmed")) {

        return `
            <span class="status-badge status-confirmed">
                Confirmed
            </span>
        `;

    }


    return `
        <span class="status-badge status-pending">
            ${escapeHTML(value)}
        </span>
    `;

}


/* =========================================================
   CANCEL BOOKING BY ADMIN
   ========================================================= */

function adminCancelBooking(bookingId) {

    const bookings = getAdminBookings();


    const booking = bookings.find(
        function (item) {

            return String(
                item.id ||
                item.bookingId ||
                item.bookingID
            ) === String(bookingId);

        }
    );


    if (!booking) {

        alert("Booking not found.");

        return;

    }


    const reason = prompt(
        "Enter the reason for cancelling this booking:"
    );


    if (reason === null) {

        return;

    }


    const cleanReason =
        reason.trim();


    if (!cleanReason) {

        alert(
            "Cancellation reason is required."
        );

        return;

    }


    booking.status =
        "Cancelled by Admin";


    booking.cancelledBy =
        "Admin";


    booking.cancellationReason =
        cleanReason;


    booking.cancelledAt =
        new Date().toISOString();


    saveAdminBookings(bookings);


    alert(
        "Booking " +
        bookingId +
        " has been cancelled."
    );


    updateDashboard();

}


/* =========================================================
   LOAD BOOKING MANAGEMENT
   ========================================================= */

function loadBookings() {

    updateBookingIds();

    updateCompletedBookings();


    const bookings =
        getAdminBookings();


    const tbody =
        document.getElementById(
            "bookingTableBody"
        );


    if (!tbody) {
        return;
    }


    const activeBookings =
        bookings.filter(function (booking) {

            return String(
                booking.status || ""
            ).toLowerCase() !== "completed";

        });


    if (activeBookings.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="14" class="empty-message">
                    No active bookings found.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        activeBookings.map(
            function (booking) {

                const status =
                    String(
                        booking.status ||
                        "Pending"
                    );


                const cancellation =
                    booking.cancellationReason
                        ? escapeHTML(
                            booking.cancellationReason
                        )
                        : "-";


                let action = "-";


                if (
                    status.toLowerCase() ===
                    "confirmed"
                ) {

                    action = `
                        <button
                            class="delete-btn"
                            onclick="adminCancelBooking('${getBookingId(booking)}')"
                        >
                            Cancel
                        </button>
                    `;

                }


                return `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    getBookingId(booking)
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                getUserId(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getUserName(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getHotelName(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getCity(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getRoomType(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getPersons(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getAcType(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getCheckIn(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getCheckOut(booking)
                            )}
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    getBookingAmount(booking)
                                )}
                            </strong>
                        </td>

                        <td>
                            ${getStatusHTML(status)}
                        </td>

                        <td>
                            ${cancellation}
                        </td>

                        <td>
                            ${action}
                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================================
   LOAD COMPLETED BOOKINGS
   ========================================================= */

function loadCompletedBookings() {

    const bookings =
        getCompletedBookings();


    const tbody =
        document.getElementById(
            "completedBookingTableBody"
        );


    if (!tbody) {
        return;
    }


    if (bookings.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="12" class="empty-message">
                    No completed bookings found.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        bookings.map(
            function (booking) {

                return `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    getBookingId(booking)
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                getUserId(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getUserName(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getHotelName(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getCity(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getRoomType(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getPersons(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getAcType(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getCheckIn(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getCheckOut(booking)
                            )}
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    getBookingAmount(booking)
                                )}
                            </strong>
                        </td>

                        <td>
                            ${getStatusHTML(
                                "Completed"
                            )}
                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================================
   LOAD HOTELS
   ========================================================= */

function loadHotels() {

    const hotels =
        getAdminHotels();


    hotels.forEach(function (hotel) {

        normalizeHotelManager(hotel);

    });


    saveAdminHotels(hotels);


    const tbody =
        document.getElementById(
            "hotelTableBody"
        );


    if (!tbody) {
        return;
    }


    if (hotels.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    No hotels available.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        hotels.map(
            function (hotel) {

                const manager =
                    hotel.manager || {};


                const lowestPrice =
                    getLowestHotelPrice(hotel);


                return `

                    <tr>

                        <td>
                            ${escapeHTML(
                                hotel.id
                            )}
                        </td>

                        <td>

                            <div class="hotel-title">
                                ${escapeHTML(
                                    hotel.name
                                )}
                            </div>

                            <div class="hotel-city">
                                ${escapeHTML(
                                    hotel.city
                                )}
                            </div>

                        </td>

                        <td>
                            ${escapeHTML(
                                hotel.city
                            )}
                        </td>

                        <td>

                            <div class="manager-box">

                                <div class="manager-name">
                                    👨‍💼
                                    ${escapeHTML(
                                        manager.name ||
                                        "Hotel Manager"
                                    )}
                                </div>

                                <div class="manager-info">
                                    📞
                                    ${escapeHTML(
                                        manager.phone ||
                                        "Not Available"
                                    )}
                                </div>

                                <div class="manager-info">
                                    ✉️
                                    ${escapeHTML(
                                        manager.email ||
                                        "Not Available"
                                    )}
                                </div>

                                <button
                                    class="edit-manager-btn"
                                    onclick="editManager('${hotel.id}')"
                                >
                                    ✏️ Edit Manager
                                </button>

                            </div>

                        </td>

                        <td>
                            ⭐
                            ${escapeHTML(
                                hotel.rating ||
                                "4.5"
                            )}
                        </td>

                        <td class="price-text">
                            ${formatCurrency(
                                lowestPrice
                            )}
                        </td>

                        <td>

                            <button
                                class="delete-btn"
                                onclick="deleteHotel('${hotel.id}')"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================================
   GET LOWEST HOTEL PRICE
   ========================================================= */

function getLowestHotelPrice(hotel) {

    if (
        Array.isArray(hotel.rooms) &&
        hotel.rooms.length > 0
    ) {

        const prices =
            hotel.rooms
                .map(function (room) {
                    return Number(room.price || 0);
                })
                .filter(function (price) {
                    return price > 0;
                });


        if (prices.length > 0) {

            return Math.min.apply(
                null,
                prices
            );

        }

    }


    return Number(
        hotel.price ||
        hotel.startingPrice ||
        0
    );

}


/* =========================================================
   EDIT MANAGER
   ========================================================= */

function editManager(hotelId) {

    const hotels =
        getAdminHotels();


    const hotel =
        hotels.find(
            function (item) {

                return String(item.id) ===
                    String(hotelId);

            }
        );


    if (!hotel) {

        alert("Hotel not found.");

        return;

    }


    normalizeHotelManager(hotel);


    const manager =
        hotel.manager;


    document.getElementById(
        "editManagerHotelId"
    ).value = hotel.id;


    document.getElementById(
        "editManagerHotelName"
    ).value = hotel.name || "";


    document.getElementById(
        "editManagerName"
    ).value =
        manager.name || "";


    document.getElementById(
        "editManagerPhone"
    ).value =
        manager.phone || "";


    document.getElementById(
        "editManagerEmail"
    ).value =
        manager.email || "";


    document.getElementById(
        "editHotelLocation"
    ).value =
        hotel.location || "";


    document.getElementById(
        "editHotelLocationLink"
    ).value =
        hotel.locationLink || "";


    const card =
        document.getElementById(
            "managerEditCard"
        );


    if (card) {

        card.style.display = "block";

        card.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   CLOSE MANAGER EDITOR
   ========================================================= */

function closeManagerEditor() {

    const card =
        document.getElementById(
            "managerEditCard"
        );


    if (card) {

        card.style.display = "none";

    }

}


/* =========================================================
   UPDATE MANAGER
   ========================================================= */

function updateManager(event) {

    event.preventDefault();


    const hotelId =
        document.getElementById(
            "editManagerHotelId"
        ).value ||
        document.getElementById(
            "managerHotelId"
        ).value;


    const managerName =
        document.getElementById(
            "editManagerName"
        )?.value.trim() ||
        document.getElementById(
            "managerName"
        )?.value.trim();


    const managerPhone =
        document.getElementById(
            "editManagerPhone"
        )?.value.trim() ||
        document.getElementById(
            "managerPhone"
        )?.value.trim();


    const managerEmail =
        document.getElementById(
            "editManagerEmail"
        )?.value.trim() ||
        document.getElementById(
            "managerEmail"
        )?.value.trim();


    const location =
        document.getElementById(
            "editHotelLocation"
        )?.value.trim() ||
        document.getElementById(
            "managerLocation"
        )?.value.trim();


    const locationLink =
        document.getElementById(
            "editHotelLocationLink"
        )?.value.trim() ||
        document.getElementById(
            "managerLocationLink"
        )?.value.trim();


    if (!hotelId) {

        alert("Please select a hotel.");

        return;

    }


    if (
        !managerName ||
        !managerPhone ||
        !managerEmail ||
        !location
    ) {

        alert(
            "Please fill all manager details."
        );

        return;

    }


    const hotels =
        getAdminHotels();


    const hotel =
        hotels.find(
            function (item) {

                return String(item.id) ===
                    String(hotelId);

            }
        );


    if (!hotel) {

        alert("Hotel not found.");

        return;

    }


    hotel.manager = {

        name: managerName,

        phone: managerPhone,

        email: managerEmail

    };


    hotel.location =
        location;


    hotel.locationLink =
        locationLink ||
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
            hotel.name + " " + hotel.city
        );


    saveAdminHotels(hotels);


    alert(
        "Manager details updated successfully."
    );


    loadHotels();

    loadManagerHotels();

    loadManagerDetails();


    closeManagerEditor();

}


/* =========================================================
   MANAGER DETAILS DROPDOWN
   ========================================================= */

function loadManagerHotels() {

    const select =
        document.getElementById(
            "managerHotelSelect"
        );


    if (!select) {
        return;
    }


    const hotels =
        getAdminHotels();


    const currentValue =
        select.value;


    select.innerHTML = `
        <option value="">
            Select Hotel
        </option>
    `;


    hotels.forEach(function (hotel) {

        const option =
            document.createElement("option");


        option.value =
            hotel.id;


        option.textContent =
            hotel.name +
            " - " +
            hotel.city;


        select.appendChild(option);

    });


    if (currentValue) {

        select.value =
            currentValue;

    }

}


/* =========================================================
   LOAD SELECTED MANAGER DETAILS
   ========================================================= */

function loadManagerDetails() {

    const select =
        document.getElementById(
            "managerHotelSelect"
        );


    const card =
        document.getElementById(
            "managerDetailsCard"
        );


    if (!select || !card) {
        return;
    }


    const hotelId =
        select.value;


    if (!hotelId) {

        card.style.display = "none";

        return;

    }


    const hotels =
        getAdminHotels();


    const hotel =
        hotels.find(
            function (item) {

                return String(item.id) ===
                    String(hotelId);

            }
        );


    if (!hotel) {
        return;
    }


    normalizeHotelManager(hotel);


    document.getElementById(
        "managerHotelId"
    ).value =
        hotel.id;


    document.getElementById(
        "managerHotelName"
    ).value =
        hotel.name || "";


    document.getElementById(
        "managerName"
    ).value =
        hotel.manager.name || "";


    document.getElementById(
        "managerPhone"
    ).value =
        hotel.manager.phone || "";


    document.getElementById(
        "managerEmail"
    ).value =
        hotel.manager.email || "";


    document.getElementById(
        "managerLocation"
    ).value =
        hotel.location || "";


    document.getElementById(
        "managerLocationLink"
    ).value =
        hotel.locationLink || "";


    card.style.display =
        "block";

}


/* =========================================================
   DELETE HOTEL
   ========================================================= */

function deleteHotel(hotelId) {

    const hotels =
        getAdminHotels();


    const hotel =
        hotels.find(
            function (item) {

                return String(item.id) ===
                    String(hotelId);

            }
        );


    if (!hotel) {

        alert("Hotel not found.");

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            hotel.name +
            "?"
        );


    if (!confirmDelete) {
        return;
    }


    const updatedHotels =
        hotels.filter(
            function (item) {

                return String(item.id) !==
                    String(hotelId);

            }
        );


    saveAdminHotels(
        updatedHotels
    );


    alert(
        "Hotel deleted successfully."
    );


    loadHotels();

    loadManagerHotels();

    updateDashboard();

}


/* =========================================================
   ADD HOTEL
   ========================================================= */

function addHotel(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "hotelName"
        ).value.trim();


    const city =
        document.getElementById(
            "hotelCity"
        ).value.trim();


    const rating =
        Number(
            document.getElementById(
                "hotelRating"
            ).value
        );


    const price =
        Number(
            document.getElementById(
                "hotelPrice"
            ).value
        );


    const managerName =
        document.getElementById(
            "newManagerName"
        ).value.trim();


    const managerPhone =
        document.getElementById(
            "newManagerPhone"
        ).value.trim();


    const managerEmail =
        document.getElementById(
            "newManagerEmail"
        ).value.trim();


    const location =
        document.getElementById(
            "newHotelLocation"
        ).value.trim();


    const locationLink =
        document.getElementById(
            "newHotelLocationLink"
        ).value.trim();


    const image =
        document.getElementById(
            "hotelImage"
        ).value.trim();


    const description =
        document.getElementById(
            "hotelDescription"
        ).value.trim();


    if (
        !name ||
        !city ||
        !managerName ||
        !managerPhone ||
        !managerEmail ||
        !location
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    const hotels =
        getAdminHotels();


    let nextId = 1;


    if (hotels.length > 0) {

        const ids =
            hotels.map(function (hotel) {

                return Number(hotel.id) || 0;

            });


        nextId =
            Math.max.apply(
                null,
                ids
            ) + 1;

    }


    const hotel = {

        id: nextId,

        name: name,

        city: city,

        rating: rating || 4.5,

        location: location,

        locationLink:
            locationLink ||
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(
                name + " " + city
            ),

        image:
            image ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945",

        description:
            description ||
            "Comfortable hotel with modern facilities.",

        manager: {

            name: managerName,

            phone: managerPhone,

            email: managerEmail

        },

        amenities: [

            "Free WiFi",

            "Restaurant",

            "Parking",

            "AC"

        ],

        rooms: [

            {
                type: "Standard Room",
                capacity: 2,
                ac: "AC",
                price: price || 2500
            },

            {
                type: "Executive Room",
                capacity: 3,
                ac: "AC",
                price: (price || 2500) + 1000
            },

            {
                type: "Family Suite",
                capacity: 4,
                ac: "AC",
                price: (price || 2500) + 2000
            }

        ]

    };


    hotels.push(hotel);


    saveAdminHotels(
        hotels
    );


    alert(
        "Hotel added successfully."
    );


    event.target.reset();


    loadHotels();

    loadManagerHotels();

    updateDashboard();

}


/* =========================================================
   USER MANAGEMENT
   ========================================================= */

function getUsers() {

    const users =
        JSON.parse(
            localStorage.getItem("users") ||
            "[]"
        );


    return Array.isArray(users)
        ? users
        : [];

}


function loadUsers() {

    updateUserIds();


    const users =
        getUsers();


    const tbody =
        document.getElementById(
            "userTableBody"
        );


    if (!tbody) {
        return;
    }


    if (users.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No users registered.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        users.map(
            function (user) {

                return `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    user.id || "-"
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                user.name || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                user.email || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                user.mobile ||
                                user.phone ||
                                "-"
                            )}
                        </td>

                        <td>

                            <button
                                class="delete-btn"
                                onclick="deleteUser('${user.id}')"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================================
   DELETE USER
   ========================================================= */

function deleteUser(userId) {

    const users =
        getUsers();


    const user =
        users.find(
            function (item) {

                return String(item.id) ===
                    String(userId);

            }
        );


    if (!user) {

        alert("User not found.");

        return;

    }


    const confirmed =
        confirm(
            "Delete user " +
            user.name +
            "?"
        );


    if (!confirmed) {
        return;
    }


    const updatedUsers =
        users.filter(
            function (item) {

                return String(item.id) !==
                    String(userId);

            }
        );


    localStorage.setItem(
        "users",
        JSON.stringify(
            updatedUsers
        )
    );


    alert(
        "User deleted successfully."
    );


    loadUsers();

    updateDashboard();

}


/* =========================================================
   PAYMENT MODULE
   ========================================================= */

function getPaymentBookings() {

    const bookings =
        getAdminBookings();


    return bookings.filter(
        function (booking) {

            return String(
                booking.paymentStatus || ""
            ).toLowerCase() === "paid";

        }
    );

}


function getPaymentBreakdown(booking) {

    const amount =
        getBookingAmount(booking);


    if (
        typeof calculatePaymentBreakdown ===
        "function"
    ) {

        return calculatePaymentBreakdown(
            amount
        );

    }


    const adminAmount =
        Math.round(
            amount * 0.10
        );


    const paymentAmount =
        Math.round(
            amount * 0.10
        );


    const hotelAmount =
        amount -
        adminAmount -
        paymentAmount;


    return {

        total: amount,

        adminAmount:
            adminAmount,

        paymentAmount:
            paymentAmount,

        hotelAmount:
            hotelAmount

    };

}


/* =========================================================
   LOAD PAYMENT MODULE
   ========================================================= */

function loadPayments() {

    const bookings =
        getPaymentBookings();


    let totalPaid = 0;

    let adminRevenue = 0;

    let paymentRevenue = 0;

    let hotelRevenue = 0;


    bookings.forEach(
        function (booking) {

            const breakdown =
                getPaymentBreakdown(
                    booking
                );


            totalPaid +=
                breakdown.total;


            adminRevenue +=
                breakdown.adminAmount;


            paymentRevenue +=
                breakdown.paymentAmount;


            hotelRevenue +=
                breakdown.hotelAmount;

        }
    );


    const totalPaidElement =
        document.getElementById(
            "paymentTotalPaid"
        );


    const adminElement =
        document.getElementById(
            "paymentAdminRevenue"
        );


    const moduleElement =
        document.getElementById(
            "paymentModuleRevenue"
        );


    const hotelElement =
        document.getElementById(
            "paymentHotelRevenue"
        );


    if (totalPaidElement) {

        totalPaidElement.textContent =
            formatCurrency(
                totalPaid
            );

    }


    if (adminElement) {

        adminElement.textContent =
            formatCurrency(
                adminRevenue
            );

    }


    if (moduleElement) {

        moduleElement.textContent =
            formatCurrency(
                paymentRevenue
            );

    }


    if (hotelElement) {

        hotelElement.textContent =
            formatCurrency(
                hotelRevenue
            );

    }


    const tbody =
        document.getElementById(
            "paymentTableBody"
        );


    if (!tbody) {
        return;
    }


    if (bookings.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="12" class="empty-message">
                    No paid transactions found.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        bookings.map(
            function (booking) {

                const breakdown =
                    getPaymentBreakdown(
                        booking
                    );


                const paymentDate =
                    booking.paymentDate ||
                    booking.paidAt ||
                    booking.createdAt ||
                    "-";


                let displayDate =
                    paymentDate;


                if (
                    paymentDate !== "-" &&
                    !isNaN(
                        new Date(paymentDate)
                    )
                ) {

                    displayDate =
                        new Date(
                            paymentDate
                        ).toLocaleDateString(
                            "en-IN"
                        );

                }


                return `

                    <tr>

                        <td>
                            ${escapeHTML(
                                getBookingId(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getUserId(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getUserName(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getHotelName(booking)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                getRoomType(booking)
                            )}
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    breakdown.total
                                )}
                            </strong>
                        </td>

                        <td>
                            ${formatCurrency(
                                breakdown.adminAmount
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                breakdown.paymentAmount
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                breakdown.hotelAmount
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                booking.paymentMethod ||
                                "-"
                            )}
                        </td>

                        <td>
                            <span class="status-badge status-confirmed">
                                Paid
                            </span>
                        </td>

                        <td>
                            ${escapeHTML(
                                displayDate
                            )}
                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================================
   REVIEWS
   ========================================================= */

function getReviews() {

    const reviews =
        JSON.parse(
            localStorage.getItem(
                "reviews"
            ) || "[]"
        );


    return Array.isArray(reviews)
        ? reviews
        : [];

}


function loadReviews() {

    const reviews =
        getReviews();


    const tbody =
        document.getElementById(
            "reviewTableBody"
        );


    if (!tbody) {
        return;
    }


    if (reviews.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No reviews available.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        reviews.map(
            function (review) {

                return `

                    <tr>

                        <td>
                            ${escapeHTML(
                                review.userName ||
                                review.name ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                review.hotelName ||
                                review.hotel ||
                                "-"
                            )}
                        </td>

                        <td>
                            ⭐
                            ${escapeHTML(
                                review.rating ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                review.comment ||
                                review.review ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                review.date ||
                                "-"
                            )}
                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================================
   DASHBOARD STATS
   ========================================================= */

function updateDashboard() {

    updateBookingIds();

    updateCompletedBookings();

    updateUserIds();


    const hotels =
        getAdminHotels();


    const users =
        getUsers();


    const bookings =
        getAdminBookings();


    const completed =
        getCompletedBookings();


    const totalHotelsElement =
        document.getElementById(
            "totalHotels"
        );


    const totalUsersElement =
        document.getElementById(
            "totalUsers"
        );


    const totalBookingsElement =
        document.getElementById(
            "totalBookings"
        );


    const completedBookingsElement =
        document.getElementById(
            "completedBookings"
        );


    const totalRevenueElement =
        document.getElementById(
            "totalRevenue"
        );


    if (totalHotelsElement) {

        totalHotelsElement.textContent =
            hotels.length;

    }


    if (totalUsersElement) {

        totalUsersElement.textContent =
            users.length;

    }


    if (totalBookingsElement) {

        totalBookingsElement.textContent =
            bookings.length;

    }


    if (completedBookingsElement) {

        completedBookingsElement.textContent =
            completed.length;

    }


    if (totalRevenueElement) {

        totalRevenueElement.textContent =
            formatCurrency(
                getCompletedRevenue()
            );

    }


    loadRecentBookings();

}


/* =========================================================
   RECENT BOOKINGS
   ========================================================= */

function loadRecentBookings() {

    const bookings =
        getAdminBookings();


    const container =
        document.getElementById(
            "recentBookings"
        );


    if (!container) {
        return;
    }


    if (bookings.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                No recent bookings.
            </div>
        `;

        return;

    }


    const recent =
        [...bookings]
            .sort(
                function (a, b) {

                    return new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    );

                }
            )
            .slice(0, 5);


    container.innerHTML =
        recent.map(
            function (booking) {

                return `

                    <div class="recent-booking-card">

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            gap:15px;
                            flex-wrap:wrap;
                        ">

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        getHotelName(
                                            booking
                                        )
                                    )}
                                </strong>

                                <p>
                                    Booking ID:
                                    <strong>
                                        ${escapeHTML(
                                            getBookingId(
                                                booking
                                            )
                                        )}
                                    </strong>
                                </p>

                                <p>
                                    User:
                                    ${escapeHTML(
                                        getUserName(
                                            booking
                                        )
                                    )}
                                </p>

                                <p>
                                    Room:
                                    ${escapeHTML(
                                        getRoomType(
                                            booking
                                        )
                                    )}
                                </p>

                            </div>

                            <div style="text-align:right;">

                                <strong>
                                    ${formatCurrency(
                                        getBookingAmount(
                                            booking
                                        )
                                    )}
                                </strong>

                                <br>

                                ${getStatusHTML(
                                    booking.status
                                )}

                            </div>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   SECTION SWITCHING
   ========================================================= */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(
            ".admin-section"
        );


    sections.forEach(
        function (section) {

            section.classList.remove(
                "active"
            );

        }
    );


    const selected =
        document.getElementById(
            sectionId
        );


    if (selected) {

        selected.classList.add(
            "active"
        );

    }


    const navButtons =
        document.querySelectorAll(
            ".admin-nav-btn"
        );


    navButtons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );


    const buttons =
        document.querySelectorAll(
            ".admin-nav-btn"
        );


    buttons.forEach(
        function (button) {

            const text =
                button.textContent
                    .toLowerCase();


            if (
                (sectionId === "dashboard" &&
                    text.includes("dashboard")) ||

                (sectionId === "hotels" &&
                    text.includes("hotel management")) ||

                (sectionId === "users" &&
                    text.includes("user management")) ||

                (sectionId === "bookings" &&
                    text.includes("booking management")) ||

                (sectionId === "completedBookings" &&
                    text.includes("completed bookings")) ||

                (sectionId === "payments" &&
                    text.includes("payment module")) ||

                (sectionId === "managerDetails" &&
                    text.includes("manager details")) ||

                (sectionId === "reviews" &&
                    text.includes("reviews"))
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );


    /* Refresh the selected section */

    if (sectionId === "dashboard") {

        updateDashboard();

    }


    if (sectionId === "hotels") {

        loadHotels();

        loadManagerHotels();

    }


    if (sectionId === "users") {

        loadUsers();

    }


    if (sectionId === "bookings") {

        loadBookings();

    }


    if (sectionId === "completedBookings") {

        loadCompletedBookings();

    }


    if (sectionId === "payments") {

        loadPayments();

    }


    if (sectionId === "managerDetails") {

        loadManagerHotels();

    }


    if (sectionId === "reviews") {

        loadReviews();

    }

}


/* =========================================================
   DISPLAY ADMIN PROFILE
   ========================================================= */

function displayAdminProfile() {

    const admin =
        JSON.parse(
            localStorage.getItem(
                "currentAdmin"
            )
        );


    if (!admin) {
        return;
    }


    const name =
        document.getElementById(
            "adminProfileName"
        );


    const role =
        document.getElementById(
            "adminProfileRole"
        );


    const email =
        document.getElementById(
            "adminProfileEmail"
        );


    if (name) {

        name.textContent =
            admin.name;

    }


    if (role) {

        role.textContent =
            admin.role;

    }


    if (email) {

        email.textContent =
            admin.email;

    }

}


/* =========================================================
   INITIALIZE ADMIN DASHBOARD
   ========================================================= */

function initializeAdmin() {

    if (!checkAdminLogin()) {
        return;
    }


    updateUserIds();

    updateBookingIds();

    updateCompletedBookings();


    displayAdminProfile();

    updateDashboard();

    loadHotels();

    loadUsers();

    loadBookings();

    loadCompletedBookings();

    loadPayments();

    loadManagerHotels();

    loadReviews();

}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeAdmin();

    }
);