// ==========================================
// STAYEASE PAYMENT + USER + MANAGER EMAIL
// ==========================================


// ==========================================
// GET LAST BOOKING
// ==========================================

function getLastBookingForPayment() {

    return JSON.parse(
        localStorage.getItem("lastBooking")
    );
}


// ==========================================
// LOAD PAYMENT DETAILS
// ==========================================

function loadPaymentDetails() {

    const booking = getLastBookingForPayment();

    if (!booking) {

        alert("No booking found.");

        window.location.href = "hotels.html";

        return;
    }


    const breakdown =
        calculatePaymentBreakdown(booking.total);


    const fields = {

        paymentBookingId: booking.id,

        paymentHotelName: booking.hotelName,

        paymentRoomType: booking.roomType,

        paymentPersons: booking.persons,

        paymentAcType: booking.acType,

        paymentCheckIn: booking.checkIn,

        paymentCheckOut: booking.checkOut,

        paymentTotalAmount:
            "₹" + booking.total,

        hotelAmount:
            "₹" + breakdown.hotelAmount,

        adminAmount:
            "₹" + breakdown.adminAmount,

        gatewayAmount:
            "₹" + breakdown.paymentAmount,

        distributionTotal:
            "₹" + breakdown.total
    };


    Object.keys(fields).forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                fields[id];

        }

    });
}


// ==========================================
// INITIALIZE EMAILJS
// ==========================================

function setupEmailJS() {

    if (typeof emailjs === "undefined") {

        console.error(
            "EmailJS SDK is not loaded."
        );

        return false;
    }


    try {

        emailjs.init({
            publicKey:
                "yyxcaZfMaKaXUNRO5"
        });


        console.log(
            "EmailJS initialized successfully."
        );


        return true;

    } catch (error) {

        console.error(
            "EmailJS initialization error:",
            error
        );

        return false;
    }
}


// ==========================================
// SMALL DELAY BETWEEN EMAILS
// ==========================================

function emailDelay(milliseconds) {

    return new Promise(function (resolve) {

        setTimeout(
            resolve,
            milliseconds
        );

    });
}


// ==========================================
// SEND USER EMAIL
// ==========================================

async function sendUserEmail(booking) {

    console.log(
        "--------------------------------"
    );

    console.log(
        "STARTING CUSTOMER EMAIL"
    );

    console.log(
        "User Email:",
        booking.userEmail
    );

    console.log(
        "Service:",
        "service_stayease7"
    );

    console.log(
        "Template:",
        "template_10sw7ru"
    );


    // Check EmailJS
    if (typeof emailjs === "undefined") {

        throw new Error(
            "EmailJS SDK was not loaded."
        );
    }


    // Check user email
    if (
        !booking.userEmail ||
        booking.userEmail.trim() === ""
    ) {

        throw new Error(
            "User email is empty. Check the user's registered email."
        );
    }


    // Initialize EmailJS
    const initialized =
        setupEmailJS();


    if (!initialized) {

        throw new Error(
            "EmailJS initialization failed."
        );
    }


    // ======================================
    // CUSTOMER EMAIL PARAMETERS
    // ======================================

    const templateParams = {

        user_email:
            booking.userEmail,

        user_name:
            booking.userName || "Customer",

        user_mobile:
            booking.userMobile || "",


        booking_id:
            booking.id,

        hotel_name:
            booking.hotelName,

        city:
            booking.city,

        room_type:
            booking.roomType,

        persons:
            booking.persons,

        ac_type:
            booking.acType,

        check_in:
            booking.checkIn,

        check_out:
            booking.checkOut,

        nights:
            booking.nights,


        price_per_night:
            "₹" +
            booking.pricePerNight,

        total_amount:
            "₹" +
            booking.total,

        payment_method:
            booking.paymentMethod,

        payment_status:
            booking.paymentStatus,

        booking_status:
            booking.status,


        manager_name:
            booking.managerName || "",

        manager_phone:
            booking.managerPhone || "",

        manager_email:
            booking.managerEmail || "",

        hotel_location:
            booking.hotelLocation || "",

        hotel_location_link:
            booking.hotelLocationLink || ""
    };


    console.log(
        "Customer email parameters:",
        templateParams
    );


    // ======================================
    // SEND CUSTOMER EMAIL
    // ======================================

    const response =
        await emailjs.send(
            "service_stayease7",
            "template_10sw7ru",
            templateParams
        );


    console.log(
        "CUSTOMER EMAIL SUCCESS"
    );

    console.log(
        "Status:",
        response.status
    );

    console.log(
        "Text:",
        response.text
    );

    console.log(
        "--------------------------------"
    );


    return true;
}


// ==========================================
// SEND MANAGER EMAIL
// ==========================================

async function sendManagerEmail(booking) {

    console.log(
        "--------------------------------"
    );

    console.log(
        "STARTING MANAGER EMAIL"
    );

    console.log(
        "Manager Email:",
        booking.managerEmail
    );

    console.log(
        "Service:",
        "service_stayease7"
    );

    console.log(
        "Template:",
        "template_43w0s1r"
    );


    // ======================================
    // CHECK MANAGER EMAIL
    // ======================================

    if (
        !booking.managerEmail ||
        booking.managerEmail.trim() === ""
    ) {

        throw new Error(
            "Manager email is empty. Please check the hotel's manager details."
        );
    }


    // ======================================
    // MANAGER EMAIL PARAMETERS
    // ======================================

    const templateParams = {

        // Manager
        manager_email:
            booking.managerEmail,

        manager_name:
            booking.managerName || "Hotel Manager",


        // Customer
        user_name:
            booking.userName || "Customer",

        user_id:
            booking.userId || "",

        user_email:
            booking.userEmail || "",

        user_phone:
            booking.userMobile || "",


        // Booking
        booking_id:
            booking.id,

        hotel_name:
            booking.hotelName,

        city:
            booking.city || "",

        room_type:
            booking.roomType,

        ac_type:
            booking.acType,

        persons:
            booking.persons,

        check_in:
            booking.checkIn,

        check_out:
            booking.checkOut,

        nights:
            booking.nights,


        // Payment
        payment_method:
            booking.paymentMethod,

        payment_status:
            booking.paymentStatus,

        total_amount:
            booking.total
    };


    console.log(
        "Manager email parameters:",
        templateParams
    );


    // ======================================
    // SEND MANAGER EMAIL
    // ======================================

    const response =
        await emailjs.send(
            "service_stayease7",
            "template_43w0s1r",
            templateParams
        );


    console.log(
        "MANAGER EMAIL SUCCESS"
    );

    console.log(
        "Status:",
        response.status
    );

    console.log(
        "Text:",
        response.text
    );

    console.log(
        "--------------------------------"
    );


    return true;
}


// ==========================================
// COMPLETE PAYMENT
// ==========================================

async function completePayment(event) {

    event.preventDefault();


    const booking =
        getLastBookingForPayment();


    if (!booking) {

        alert(
            "Booking information not found."
        );

        return;
    }


    // ======================================
    // PAYMENT METHOD
    // ======================================

    const selectedMethod =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    if (!selectedMethod) {

        alert(
            "Please select a payment method."
        );

        return;
    }


    const paymentMethod =
        selectedMethod.value;


    const payButton =
        document.getElementById(
            "payButton"
        );


    const message =
        document.getElementById(
            "paymentMessage"
        );


    if (payButton) {

        payButton.disabled = true;

        payButton.textContent =
            "Processing Payment...";
    }


    if (message) {

        message.innerHTML = `
            <span style="color:#2563eb;">
                Processing payment...
            </span>
        `;
    }


    // ======================================
    // DEMO PAYMENT
    // ======================================

    await new Promise(function (resolve) {

        setTimeout(
            resolve,
            1200
        );

    });


    // ======================================
    // GET BOOKINGS
    // ======================================

    const bookings =
        getBookings();


    const index =
        bookings.findIndex(function (item) {

            return String(item.id) ===
                String(booking.id);

        });


    if (index === -1) {

        alert(
            "Booking record not found."
        );

        if (payButton) {

            payButton.disabled = false;

            payButton.textContent =
                "Pay & Confirm Booking";
        }

        return;
    }


    // ======================================
    // MARK PAYMENT AS PAID
    // ======================================

    bookings[index].paymentMethod =
        paymentMethod;

    bookings[index].paymentStatus =
        "Paid";

    bookings[index].status =
        "Confirmed";

    bookings[index].paidAt =
        new Date().toISOString();


    const paidBooking =
        bookings[index];


    // ======================================
    // SAVE BOOKING
    // ======================================

    saveBookings(bookings);


    // ======================================
    // SAVE LAST BOOKING
    // ======================================

    localStorage.setItem(
        "lastBooking",
        JSON.stringify(
            paidBooking
        )
    );


    // ======================================
    // PAYMENT SUCCESS
    // ======================================

    if (message) {

        message.innerHTML = `
            <span style="color:#2563eb;">

                ✓ Payment successful!

                <br>

                ✓ Booking confirmed.

                <br>

                Sending confirmation emails...

            </span>
        `;
    }


    // ======================================
    // SEND CUSTOMER EMAIL
    // ======================================

    let userEmailSent = false;

    let managerEmailSent = false;

    let userEmailError = "";

    let managerEmailError = "";


    // ======================================
    // CUSTOMER EMAIL
    // ======================================

    try {

        await sendUserEmail(
            paidBooking
        );

        userEmailSent = true;

        console.log(
            "✓ Customer email sent successfully."
        );

    } catch (error) {

        console.error(
            "Customer email failed:",
            error
        );


        if (error && error.text) {

            userEmailError =
                error.text;

        } else if (
            error &&
            error.message
        ) {

            userEmailError =
                error.message;

        } else {

            userEmailError =
                "Customer email could not be sent.";
        }
    }


    // ======================================
    // WAIT BEFORE SECOND EMAIL
    // ======================================

    if (userEmailSent) {

        await emailDelay(1200);

    }


    // ======================================
    // MANAGER EMAIL
    // ======================================

    try {

        await sendManagerEmail(
            paidBooking
        );

        managerEmailSent = true;

        console.log(
            "✓ Manager email sent successfully."
        );

    } catch (error) {

        console.error(
            "Manager email failed:",
            error
        );


        if (error && error.text) {

            managerEmailError =
                error.text;

        } else if (
            error &&
            error.message
        ) {

            managerEmailError =
                error.message;

        } else {

            managerEmailError =
                "Manager email could not be sent.";
        }
    }


    // ======================================
    // BOTH EMAILS SUCCESS
    // ======================================

    if (
        userEmailSent &&
        managerEmailSent
    ) {

        if (message) {

            message.innerHTML = `
                <span style="color:#16803c;">

                    ✓ Payment successful!

                    <br>

                    ✓ Booking confirmed!

                    <br>

                    ✓ Confirmation email sent
                    to ${paidBooking.userEmail}

                    <br>

                    ✓ Manager notification sent
                    to ${paidBooking.managerEmail}

                </span>
            `;
        }


        if (payButton) {

            payButton.textContent =
                "Payment Successful";
        }


        // Go to bookings
        setTimeout(function () {

            window.location.href =
                "bookings.html";

        }, 3000);


        return;
    }


    // ======================================
    // CUSTOMER EMAIL SUCCESS
    // MANAGER EMAIL FAILED
    // ======================================

    if (
        userEmailSent &&
        !managerEmailSent
    ) {

        if (message) {

            message.innerHTML = `
                <span style="color:#b45309;">

                    ✓ Payment successful!

                    <br>

                    ✓ Booking confirmed!

                    <br>

                    ✓ Customer confirmation email sent.

                    <br>

                    ⚠ Manager email failed.

                    <br><br>

                    <small>
                        ${managerEmailError}
                    </small>

                </span>
            `;
        }


        if (payButton) {

            payButton.textContent =
                "Payment Successful";
        }


        setTimeout(function () {

            window.location.href =
                "bookings.html";

        }, 5000);


        return;
    }


    // ======================================
    // CUSTOMER EMAIL FAILED
    // MANAGER EMAIL SUCCESS
    // ======================================

    if (
        !userEmailSent &&
        managerEmailSent
    ) {

        if (message) {

            message.innerHTML = `
                <span style="color:#b45309;">

                    ✓ Payment successful!

                    <br>

                    ✓ Booking confirmed!

                    <br>

                    ✓ Manager notification sent.

                    <br>

                    ⚠ Customer email failed.

                    <br><br>

                    <small>
                        ${userEmailError}
                    </small>

                </span>
            `;
        }


        if (payButton) {

            payButton.textContent =
                "Payment Successful";
        }


        setTimeout(function () {

            window.location.href =
                "bookings.html";

        }, 5000);


        return;
    }


    // ======================================
    // BOTH EMAILS FAILED
    // ======================================

    if (
        !userEmailSent &&
        !managerEmailSent
    ) {

        if (message) {

            message.innerHTML = `
                <span style="color:#b45309;">

                    ✓ Payment successful!

                    <br>

                    ✓ Booking confirmed!

                    <br>

                    ⚠ Emails could not be sent.

                    <br><br>

                    <small>
                        Customer Email:
                        ${userEmailError}
                    </small>

                    <br><br>

                    <small>
                        Manager Email:
                        ${managerEmailError}
                    </small>

                </span>
            `;
        }


        if (payButton) {

            payButton.textContent =
                "Payment Successful";
        }


        /*
         * IMPORTANT:
         *
         * Payment is already successful.
         * Do NOT cancel the booking because
         * an email failed.
         */

        setTimeout(function () {

            window.location.href =
                "bookings.html";

        }, 5000);

    }
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPaymentDetails();

    }
);