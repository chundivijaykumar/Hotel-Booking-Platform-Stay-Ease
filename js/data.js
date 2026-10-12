/* =========================================================
   STAYEASE - DATA.JS
   Hotel data, room inventory, availability and payment data
   ========================================================= */

const PAYMENT_CONFIG = {
    ADMIN_PERCENTAGE: 10,
    PAYMENT_PERCENTAGE: 10,
    HOTEL_PERCENTAGE: 80
};

const EMAIL_CONFIG = {
    SERVICE_ID: "service_stayease7",
    PUBLIC_KEY: "yyxcaZfMaKaXUNRO5",
    USER_TEMPLATE_ID: "template_10sw7ru"
};

/* =========================================================
   ROOM CONFIGURATION
   ========================================================= */

const ROOM_TYPE_CONFIG = [
    {
        type: "Standard Room",
        capacity: 2,
        startNumber: 101,
        nonACMultiplier: 0.80
    },
    {
        type: "Deluxe Room",
        capacity: 3,
        startNumber: 201,
        nonACMultiplier: 0.82
    },
    {
        type: "Family Suite",
        capacity: 4,
        startNumber: 301,
        nonACMultiplier: 0.84
    }
];

/* =========================================================
   DEFAULT HOTELS
   ========================================================= */

const DEFAULT_HOTELS = [
    {
        id: 1,
        name: "Taj Krishna",
        city: "Hyderabad",
        location: "Banjara Hills, Hyderabad",
        locationLink: "https://maps.google.com/?q=Taj+Krishna+Hyderabad",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        description: "A premium hotel offering comfortable rooms, modern facilities and excellent hospitality.",
        amenities: [
            "Free Wi-Fi",
            "Swimming Pool",
            "Restaurant",
            "Parking",
            "Gym",
            "24/7 Room Service"
        ],
        manager: {
            name: "Ravi Kumar",
            phone: "9876543210",
            email: "ravi.manager@stayease.in"
        },
        basePrices: {
            standard: 3000,
            deluxe: 4000,
            family: 5000
        }
    },
    {
        id: 2,
        name: "ITC Kakatiya",
        city: "Hyderabad",
        location: "Somajiguda, Hyderabad",
        locationLink: "https://maps.google.com/?q=ITC+Kakatiya+Hyderabad",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        description: "A luxurious hotel with elegant rooms, dining facilities and premium guest services.",
        amenities: [
            "Free Wi-Fi",
            "Restaurant",
            "Parking",
            "Gym",
            "Conference Hall",
            "Room Service"
        ],
        manager: {
            name: "Suresh Reddy",
            phone: "9865432109",
            email: "suresh.manager@stayease.in"
        },
        basePrices: {
            standard: 2800,
            deluxe: 3800,
            family: 4800
        }
    },
    {
        id: 3,
        name: "Novotel Hyderabad",
        city: "Hyderabad",
        location: "HITEC City, Hyderabad",
        locationLink: "https://maps.google.com/?q=Novotel+Hyderabad",
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
        description: "A modern hotel suitable for business and leisure travellers.",
        amenities: [
            "Free Wi-Fi",
            "Swimming Pool",
            "Restaurant",
            "Parking",
            "Fitness Centre",
            "Business Centre"
        ],
        manager: {
            name: "Anjali Reddy",
            phone: "9988776655",
            email: "anjali.manager@stayease.in"
        },
        basePrices: {
            standard: 2700,
            deluxe: 3700,
            family: 4700
        }
    }
];

/* =========================================================
   CREATE 10 ROOMS FOR EACH ROOM TYPE
   ========================================================= */

function createRoomInventory(hotel) {

    const base = hotel.basePrices || {
        standard: 2800,
        deluxe: 3800,
        family: 4800
    };

    const prices = [
        base.standard,
        base.deluxe,
        base.family
    ];

    const roomTypes = [];

    ROOM_TYPE_CONFIG.forEach((config, index) => {

        const acPrice = prices[index];

        const nonACPrice = Math.round(
            acPrice * config.nonACMultiplier
        );

        const rooms = [];

        for (let i = 0; i < 10; i++) {

            const roomNumber =
                config.startNumber + i;

            rooms.push({
                number: String(roomNumber),
                status: "Available"
            });
        }

        roomTypes.push({
            type: config.type,
            capacity: config.capacity,

            prices: {
                "AC": acPrice,
                "Non-AC": nonACPrice
            },

            rooms: rooms
        });
    });

    return roomTypes;
}

/* =========================================================
   INITIALIZE HOTELS
   ========================================================= */

function initializeHotels() {

    let hotels =
        JSON.parse(localStorage.getItem("hotels")) || [];

    if (!hotels.length) {

        hotels = JSON.parse(
            JSON.stringify(DEFAULT_HOTELS)
        );
    }

    hotels.forEach((hotel, index) => {

        if (!hotel.id) {
            hotel.id = index + 1;
        }

        if (!hotel.manager) {

            hotel.manager = {
                name: "Hotel Manager",
                phone: "9876543210",
                email: "manager@stayease.in"
            };
        }

        if (!hotel.location) {
            hotel.location =
                `${hotel.city || "Hyderabad"} Location`;
        }

        if (!hotel.locationLink) {
            hotel.locationLink =
                "https://maps.google.com";
        }

        if (!hotel.basePrices) {

            hotel.basePrices = {
                standard: 2800,
                deluxe: 3800,
                family: 4800
            };
        }

        if (
            !hotel.roomTypes ||
            hotel.roomTypes.length !== 3
        ) {

            hotel.roomTypes =
                createRoomInventory(hotel);

        } else {

            hotel.roomTypes.forEach((roomType, index) => {

                const config =
                    ROOM_TYPE_CONFIG[index];

                if (
                    !roomType.rooms ||
                    roomType.rooms.length !== 10
                ) {

                    const rooms = [];

                    for (let i = 0; i < 10; i++) {

                        rooms.push({
                            number: String(
                                config.startNumber + i
                            ),
                            status: "Available"
                        });
                    }

                    roomType.rooms = rooms;
                }

                roomType.type =
                    config.type;

                roomType.capacity =
                    config.capacity;

                if (!roomType.prices) {

                    const price =
                        hotel.basePrices[
                            index === 0
                                ? "standard"
                                : index === 1
                                    ? "deluxe"
                                    : "family"
                        ] || 3000;

                    roomType.prices = {
                        AC: price,
                        "Non-AC":
                            Math.round(
                                price *
                                config.nonACMultiplier
                            )
                    };
                }
            });
        }
    });

    localStorage.setItem(
        "hotels",
        JSON.stringify(hotels)
    );

    return hotels;
}

/* =========================================================
   GET / SAVE HOTELS
   ========================================================= */

function getHotels() {

    initializeHotels();

    return JSON.parse(
        localStorage.getItem("hotels")
    ) || [];
}

function saveHotels(hotels) {

    localStorage.setItem(
        "hotels",
        JSON.stringify(hotels)
    );
}

function getHotelById(id) {

    const hotels = getHotels();

    return hotels.find(
        hotel => String(hotel.id) === String(id)
    );
}

/* =========================================================
   UPDATE MANAGER
   ========================================================= */

function updateHotelManager(
    hotelId,
    managerName,
    managerPhone,
    managerEmail,
    location,
    locationLink
) {

    const hotels = getHotels();

    const hotel = hotels.find(
        h => String(h.id) === String(hotelId)
    );

    if (!hotel) return false;

    hotel.manager = {
        name: managerName,
        phone: managerPhone,
        email: managerEmail
    };

    hotel.location = location;
    hotel.locationLink = locationLink;

    saveHotels(hotels);

    return true;
}

/* =========================================================
   PAYMENT CALCULATION
   ========================================================= */

function calculatePaymentBreakdown(amount) {

    amount = Number(amount) || 0;

    const adminRevenue =
        Math.round(
            amount *
            PAYMENT_CONFIG.ADMIN_PERCENTAGE /
            100
        );

    const paymentModuleRevenue =
        Math.round(
            amount *
            PAYMENT_CONFIG.PAYMENT_PERCENTAGE /
            100
        );

    const hotelRevenue =
        amount -
        adminRevenue -
        paymentModuleRevenue;

    return {
        total: amount,
        adminRevenue: adminRevenue,
        paymentModuleRevenue:
            paymentModuleRevenue,
        hotelRevenue: hotelRevenue
    };
}

/* =========================================================
   BOOKING DATA
   ========================================================= */

function getAllBookings() {

    return JSON.parse(
        localStorage.getItem("bookings")
    ) || [];
}

/* =========================================================
   DATE OVERLAP
   Checkout date is treated as the availability boundary.
   ========================================================= */

function datesOverlap(
    newCheckIn,
    newCheckOut,
    existingCheckIn,
    existingCheckOut
) {

    return (
        newCheckIn < existingCheckOut &&
        newCheckOut > existingCheckIn
    );
}

/* =========================================================
   ROOM AVAILABILITY
   IMPORTANT:
   AC / Non-AC does NOT create separate physical rooms.
   A physical room is unavailable regardless of AC choice.
   ========================================================= */

function getAvailableRooms(
    hotelId,
    roomType,
    checkIn,
    checkOut
) {

    const hotel =
        getHotelById(hotelId);

    if (!hotel) return [];

    const roomTypeData =
        hotel.roomTypes.find(
            r => r.type === roomType
        );

    if (!roomTypeData) return [];

    const bookings =
        getAllBookings();

    return roomTypeData.rooms.filter(room => {

        const roomNumber =
            String(room.number);

        const conflictingBooking =
            bookings.some(booking => {

                if (
                    String(booking.hotelId) !==
                    String(hotelId)
                ) {
                    return false;
                }

                if (
                    String(booking.roomType) !==
                    String(roomType)
                ) {
                    return false;
                }

                if (
                    String(booking.roomNumber) !==
                    roomNumber
                ) {
                    return false;
                }

                if (
                    booking.status ===
                    "Cancelled by User"
                ) {
                    return false;
                }

                if (
                    booking.status ===
                    "Cancelled by Admin"
                ) {
                    return false;
                }

                if (
                    booking.status ===
                    "Cancelled"
                ) {
                    return false;
                }

                const isActive =
                    booking.status ===
                        "Confirmed" ||
                    booking.status ===
                        "Completed" ||
                    booking.paymentStatus ===
                        "Paid";

                if (!isActive) {
                    return false;
                }

                if (
                    !booking.checkIn ||
                    !booking.checkOut
                ) {
                    return false;
                }

                return datesOverlap(
                    checkIn,
                    checkOut,
                    booking.checkIn,
                    booking.checkOut
                );
            });

        return !conflictingBooking;
    });
}

/* =========================================================
   GET ROOM TYPE
   ========================================================= */

function getRoomType(
    hotelId,
    roomTypeName
) {

    const hotel =
        getHotelById(hotelId);

    if (!hotel) return null;

    return hotel.roomTypes.find(
        r => r.type === roomTypeName
    ) || null;
}

/* =========================================================
   INITIALIZE
   ========================================================= */

initializeHotels();