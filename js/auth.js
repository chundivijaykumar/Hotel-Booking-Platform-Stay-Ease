// ============================================================
// AUTH.JS
// USER REGISTRATION / LOGIN / PROFILE
// ============================================================


// ------------------------------------------------------------
// GET USERS
// ------------------------------------------------------------

function getUsers() {

    return JSON.parse(
        localStorage.getItem("users")
    ) || [];
}


// ------------------------------------------------------------
// SAVE USERS
// ------------------------------------------------------------

function saveUsers(users) {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );
}


// ------------------------------------------------------------
// GENERATE USER ID
// ------------------------------------------------------------

function generateUserId() {

    const users = getUsers();

    const ids = users
        .map(user => parseInt(user.id))
        .filter(id => !isNaN(id));

    if (ids.length === 0) {
        return 50001;
    }

    return Math.max(...ids, 50000) + 1;
}


// ------------------------------------------------------------
// REGISTER
// ------------------------------------------------------------

function registerUser(event) {

    if (event) {
        event.preventDefault();
    }

    const name =
        document.getElementById("name")?.value.trim();

    const email =
        document.getElementById("email")?.value.trim();

    const mobile =
        document.getElementById("mobile")?.value.trim();

    const password =
        document.getElementById("password")?.value;

    if (!name || !email || !mobile || !password) {

        alert("Please fill all fields.");

        return false;
    }

    const users = getUsers();

    const existingUser = users.find(
        user =>
            user.email.toLowerCase() ===
            email.toLowerCase()
    );

    if (existingUser) {

        alert("Email is already registered.");

        return false;
    }

    const newUser = {

        id: generateUserId(),

        name: name,

        email: email,

        mobile: mobile,

        password: password,

        createdAt:
            new Date().toISOString()
    };

    users.push(newUser);

    saveUsers(users);

    alert(
        "Registration successful!\nYour User ID is " +
        newUser.id
    );

    window.location.href =
        "login.html";

    return true;
}


// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------

function loginUser(event) {

    if (event) {
        event.preventDefault();
    }

    const email =
        document.getElementById("email")?.value.trim();

    const password =
        document.getElementById("password")?.value;

    const users = getUsers();

    const user = users.find(
        item =>
            item.email.toLowerCase() ===
            email.toLowerCase() &&
            item.password === password
    );

    if (!user) {

        alert(
            "Invalid email or password."
        );

        return false;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    alert(
        "Login successful. Welcome " +
        user.name
    );

    window.location.href =
        "index.html";

    return true;
}


// ------------------------------------------------------------
// LOGOUT
// ------------------------------------------------------------

function logoutUser() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "index.html";
}


// ------------------------------------------------------------
// GET CURRENT USER
// ------------------------------------------------------------

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );
}


// ------------------------------------------------------------
// UPDATE USER PROFILE
// ------------------------------------------------------------

function updateUserProfile(event) {

    if (event) {
        event.preventDefault();
    }

    const currentUser =
        getCurrentUser();

    if (!currentUser) {

        alert("Please login first.");

        window.location.href =
            "login.html";

        return false;
    }

    const name =
        document.getElementById("profileName")
            ?.value.trim();

    const mobile =
        document.getElementById("profileMobile")
            ?.value.trim();

    const email =
        document.getElementById("profileEmail")
            ?.value.trim();

    if (!name || !mobile || !email) {

        alert(
            "Please fill all profile details."
        );

        return false;
    }

    const users = getUsers();

    const duplicateEmail =
        users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase() &&
                String(user.id) !==
                String(currentUser.id)
        );

    if (duplicateEmail) {

        alert(
            "This email is already used by another user."
        );

        return false;
    }

    const index =
        users.findIndex(
            user =>
                String(user.id) ===
                String(currentUser.id)
        );

    if (index === -1) {

        alert("User account not found.");

        return false;
    }

    users[index].name = name;

    users[index].mobile = mobile;

    users[index].email = email;

    saveUsers(users);

    localStorage.setItem(
        "currentUser",
        JSON.stringify(users[index])
    );

    alert(
        "Profile updated successfully."
    );

    loadUserProfile();

    return true;
}


// ------------------------------------------------------------
// LOAD PROFILE
// ------------------------------------------------------------

function loadUserProfile() {

    const user =
        getCurrentUser();

    if (!user) {
        return;
    }

    const name =
        document.getElementById("profileName");

    const mobile =
        document.getElementById("profileMobile");

    const email =
        document.getElementById("profileEmail");

    const userId =
        document.getElementById("profileUserId");

    if (name) {
        name.value = user.name || "";
    }

    if (mobile) {
        mobile.value = user.mobile || "";
    }

    if (email) {
        email.value = user.email || "";
    }

    if (userId) {
        userId.textContent =
            user.id || "";
    }
}


// ------------------------------------------------------------
// PASSWORD TOGGLE
// ------------------------------------------------------------

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(inputId);

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


// ------------------------------------------------------------
// PAGE LOAD
// ------------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserProfile();

    }
);