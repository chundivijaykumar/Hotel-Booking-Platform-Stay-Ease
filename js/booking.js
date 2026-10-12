// ==========================================
// STAYEASE BOOKING MODULE
// ==========================================


// ==========================================
// GET BOOKINGS
// ==========================================

function getBookings() {

    return JSON.parse(
        localStorage.getItem("bookings")
    ) || [];
}


// ==========================================
// SAVE BOOKINGS
// ==========================================

function saveBookings(bookings) {

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );
}


// ==========================================
// CURRENT USER
// ==========================================

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    ) || null;
}


// ==========================================
// GENERATE BOOKING ID
// ==========================================

function generateBookingId() {

    const bookings = getBookings();

    let maxId = 1000;

    bookings.forEach(function (booking) {

        const id = parseInt(booking.id);

        if (
            !isNaN(id) &&
            id >= 1001 &&
            id < 100000
        ) {

            if (id > maxId) {
                maxId = id;
            }

        }

    });

    return maxId + 1;
}


// ==========================================
// CALCULATE NIGHTS
// ==========================================

function calculateNights(
    checkIn,
    checkOut
) {

    const start =
        new Date(checkIn);

    const end =
        new Date(checkOut);

    const difference =
        end - start;

    const nights =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

    return nights > 0
        ? nights
        : 0;
}


// ==========================================
// CREATE BOOKING
// ==========================================

function createBooking(bookingData) {

    const user =
        getCurrentUser();


    if (!user) {

        alert(
            "Please login before booking."
        );

        window.location.href =
            "login.html";

        return null;
    }


    const hotel =
        getHotelById(
            bookingData.hotelId
        );


    if (!hotel) {

        alert(
            "Hotel information not found."
        );

        return null;
    }


    const nights =
        calculateNights(
            bookingData.checkIn,
            bookingData.checkOut
        );


    if (nights <= 0) {

        alert(
            "Please select valid dates."
        );

        return null;
    }


    const pricePerNight =
        Number(
            bookingData.price
        ) || 0;


    const total =
        pricePerNight *
        nights;


    const breakdown =
        calculatePaymentBreakdown(
            total
        );


    const booking = {

        // ==============================
        // BOOKING
        // ==============================

        id:
            generateBookingId(),


        // ==============================
        // USER
        // ==============================

        userId:
            user.id ||
            user.userId ||
            "",

        userName:
            user.name ||
            "",

        userEmail:
            user.email ||
            "",

        userMobile:
            user.mobile ||
            "",


        // ==============================
        // HOTEL
        // ==============================

        hotelId:
            hotel.id,

        hotelName:
            hotel.name,

        city:
            hotel.city,

        hotelLocation:
            hotel.location ||
            "",

        hotelLocationLink:
            hotel.locationLink ||
            "",


        // ==============================
        // MANAGER
        // ==============================

        managerName:
            hotel.manager
                ? hotel.manager.name
                : "",

        managerPhone:
            hotel.manager
                ? hotel.manager.phone
                : "",

        managerEmail:
            hotel.manager
                ? hotel.manager.email
                : "",


        // ==============================
        // ROOM
        // ==============================

        roomType:
            bookingData.roomType,

        persons:
            bookingData.persons,

        acType:
            bookingData.acType,


        // ==============================
        // DATES
        // ==============================

        checkIn:
            bookingData.checkIn,

        checkOut:
            bookingData.checkOut,

        nights:
            nights,


        // ==============================
        // AMOUNT
        // ==============================

        pricePerNight:
            pricePerNight,

        total:
            total,


        // ==============================
        // PAYMENT DISTRIBUTION
        // ==============================

        adminRevenue:
            breakdown.adminAmount,

        paymentModuleRevenue:
            breakdown.paymentAmount,

        hotelRevenue:
            breakdown.hotelAmount,


        // ==============================
        // PAYMENT
        // ==============================

        paymentMethod:
            "",

        paymentStatus:
            "Pending",


        // ==============================
        // STATUS
        // ==============================

        status:
            "Payment Pending",


        // ==============================
        // CANCELLATION
        // ==============================

        cancellationReason:
            "",

        cancelledBy:
            "",

        cancelledAt:
            "",


        // ==============================
        // COMPLETION
        // ==============================

        completedAt:
            "",


        // ==============================
        // CREATED
        // ==============================

        createdAt:
            new Date().toISOString()
    };


    const bookings =
        getBookings();


    bookings.push(
        booking
    );


    saveBookings(
        bookings
    );


    // Save for payment page
    localStorage.setItem(
        "lastBooking",
        JSON.stringify(
            booking
        )
    );


    /*
     * IMPORTANT:
     *
     * No email is sent here.
     *
     * Email is sent only after
     * successful payment.
     */


    return booking;
}


// ==========================================
// UPDATE COMPLETED BOOKINGS
// ==========================================
//
// IMPORTANT RULE:
//
// Check-out <= TODAY
//        ↓
// Completed
//
// Example:
// Today = 25-09-2026
//
// 24-09-2026 → Completed
// 25-09-2026 → Completed
// 26-09-2026 → Upcoming
//
// ==========================================

function updateCompletedBookingsForUser() {

    const bookings =
        getBookings();


    // Get today's date
    const today =
        new Date();


    // Remove time
    today.setHours(
        0,
        0,
        0,
        0
    );


    let changed = false;


    bookings.forEach(
        function (booking) {

            // Only paid/confirmed bookings
            if (
                booking.paymentStatus ===
                    "Paid" &&

                booking.status ===
                    "Confirmed"
            ) {

                if (
                    booking.checkOut
                ) {

                    const checkout =
                        new Date(
                            booking.checkOut
                        );


                    // Remove time
                    checkout.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    /*
                     * MAIN FIX:
                     *
                     * <= instead of <
                     */

                    if (
                        checkout <= today
                    ) {

                        booking.status =
                            "Completed";


                        booking.completedAt =
                            new Date().toISOString();


                        changed = true;

                    }

                }

            }

        }
    );


    if (changed) {

        saveBookings(
            bookings
        );

    }
}


// ==========================================
// LOAD USER BOOKINGS
// ==========================================

function loadUserBookings() {

    // First update completed status
    updateCompletedBookingsForUser();


    const user =
        getCurrentUser();


    if (!user) {

        return [];

    }


    const bookings =
        getBookings();


    const userId =
        user.id ||
        user.userId;


    return bookings.filter(
        function (booking) {

            return String(
                booking.userId
            ) ===
            String(
                userId
            );

        }
    );
}


// ==========================================
// DISPLAY BOOKINGS
// ==========================================

function displayBookings(
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {

        return;

    }


    const bookings =
        loadUserBookings();


    if (bookings.length === 0) {

        container.innerHTML = `

            <div class="admin-card">

                <h3>
                    No bookings found
                </h3>

                <p>
                    You have not made any
                    hotel bookings yet.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        bookings
            .map(
                function (booking) {

                    return bookingCard(
                        booking
                    );

                }
            )
            .join("");
}


// ==========================================
// BOOKING CARD
// ==========================================

function bookingCard(
    booking
) {

    let statusClass =
        "status-confirmed";


    if (
        booking.status ===
        "Completed"
    ) {

        statusClass =
            "status-completed";

    }
    else if (
        booking.status &&
        booking.status.includes(
            "Cancelled"
        )
    ) {

        statusClass =
            "status-cancelled";

    }
    else if (
        booking.status ===
        "Payment Pending"
    ) {

        statusClass =
            "status-pending";

    }


    return `

        <div class="admin-card booking-card">

            <h3>
                ${booking.hotelName}
            </h3>


            <p>
                <strong>
                    Booking ID:
                </strong>

                ${booking.id}
            </p>


            <p>
                <strong>
                    User ID:
                </strong>

                ${booking.userId}
            </p>


            <p>
                <strong>
                    City:
                </strong>

                ${booking.city}
            </p>


            <p>
                <strong>
                    Room:
                </strong>

                ${booking.roomType}
            </p>


            <p>
                <strong>
                    Persons:
                </strong>

                ${booking.persons}
            </p>


            <p>
                <strong>
                    AC / Non-AC:
                </strong>

                ${booking.acType}
            </p>


            <p>
                <strong>
                    Check-in:
                </strong>

                ${booking.checkIn}
            </p>


            <p>
                <strong>
                    Check-out:
                </strong>

                ${booking.checkOut}
            </p>


            <p>
                <strong>
                    Nights:
                </strong>

                ${booking.nights}
            </p>


            <p>
                <strong>
                    Amount:
                </strong>

                ₹${booking.total}
            </p>


            <p>
                <strong>
                    Payment:
                </strong>

                ${booking.paymentStatus}
            </p>


            <p>
                <strong>
                    Status:
                </strong>

                <span class="${statusClass}">
                    ${booking.status}
                </span>
            </p>


            ${
                booking.status ===
                "Completed"

                ? `

                    <p style="
                        color:#16803c;
                        font-weight:700;
                    ">

                        ✓ Check-out completed

                    </p>

                `
                : ""
            }


            ${
                booking.cancellationReason

                ? `

                    <p>

                        <strong>
                            Cancellation:
                        </strong>

                        ${booking.cancellationReason}

                    </p>

                `
                : ""
            }


            ${
                booking.status !==
                    "Completed" &&

                !(
                    booking.status &&
                    booking.status.includes(
                        "Cancelled"
                    )
                ) &&

                booking.status ===
                    "Confirmed"

                ? `

                    <button
                        class="btn btn-danger"
                        onclick="
                            cancelUserBooking(
                                ${booking.id}
                            )
                        "
                    >

                        Cancel Booking

                    </button>

                `
                : ""
            }


        </div>

    `;
}


// ==========================================
// USER CANCEL BOOKING
// ==========================================

function cancelUserBooking(
    bookingId
) {

    const bookings =
        getBookings();


    const booking =
        bookings.find(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    bookingId
                );

            }
        );


    if (!booking) {

        alert(
            "Booking not found."
        );

        return;
    }


    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmCancel) {

        return;

    }


    booking.status =
        "Cancelled by User";


    booking.cancelledBy =
        "User";


    booking.cancellationReason =
        "Cancelled by User";


    booking.cancelledAt =
        new Date().toISOString();


    saveBookings(
        bookings
    );


    alert(
        "Booking cancelled successfully."
    );


    location.reload();
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            document.getElementById(
                "bookingsContainer"
            )
        ) {

            displayBookings(
                "bookingsContainer"
            );

        }

    }
);