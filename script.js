// ==========================================================
// FIREBASE IMPORT
// ==========================================================

import { database } from "./firebase.js";

import {

    ref,

    onValue

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ==========================================================
// FIREBASE REFERENCES
// ==========================================================

const batteryRef =
ref(database, "battery");

const deviceRef =
ref(database, "device");

const userRef =
ref(database, "user");

const fallRef =
ref(database, "fall");

const sosRef =
ref(database, "sos");

const emergencyRef =
ref(database, "emergency");

const aiRef =
ref(database, "ai");

const historyRef =
ref(database, "history");


// ==========================================================
// DOM REFERENCES
// ==========================================================

const batteryPercentage =
document.getElementById(
"batteryPercentage"
);

const batteryVoltage =
document.getElementById(
"batteryVoltage"
);

const batteryHealth =
document.getElementById(
"batteryHealth"
);

const batteryBar =
document.getElementById(
"batteryBar"
);


// ----------------------------------------------------------

const onlineDot =
document.getElementById(
"onlineDot"
);

const onlineStatus =
document.getElementById(
"onlineStatus"
);

const lastUpdated =
document.getElementById(
"lastUpdated"
);


// ----------------------------------------------------------

const walkingStatus =
document.getElementById(
"walkingStatus"
);

const walkingSince =
document.getElementById(
"walkingSince"
);


// ----------------------------------------------------------

const fallStatus =
document.getElementById(
"fallStatus"
);

const fallLastActivated =
document.getElementById(
"fallLastActivated"
);


// ----------------------------------------------------------

const sosStatus =
document.getElementById(
"sosStatus"
);

const sosLastActivated =
document.getElementById(
"sosLastActivated"
);


// ----------------------------------------------------------

const emergencyType =
document.getElementById(
"emergencyType"
);

const emergencyTime =
document.getElementById(
"emergencyTime"
);

const emergencyLatitude =
document.getElementById(
"emergencyLatitude"
);

const emergencyLongitude =
document.getElementById(
"emergencyLongitude"
);

const mapButton =
document.getElementById(
"mapButton"
);


// ----------------------------------------------------------

const sceneDescription =
document.getElementById(
"sceneDescription"
);

const sceneTime =
document.getElementById(
"sceneTime"
);

const sceneImage =
document.getElementById(
"sceneImage"
);

const imagePlaceholder =
document.getElementById(
"imagePlaceholder"
);


// ----------------------------------------------------------

const historyContainer =
document.getElementById(
"historyContainer"
);


// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let latestHeartbeat = null;

let onlineSince = null;

let walkingStart = null;

let lastBattery = 0;

// ==========================================================
// HELPER FUNCTIONS
// ==========================================================

function setText(element, value) {

    if (element) {

        element.textContent = value;

    }

}


// ==========================================================
// BATTERY HEALTH
// ==========================================================

function getBatteryHealth(percent) {

    if (percent >= 80) {

        return {
            text: "Healthy",
            color: "#16A34A"
        };

    }

    if (percent >= 40) {

        return {
            text: "Medium",
            color: "#F59E0B"
        };

    }

    return {

        text: "Low",

        color: "#DC2626"

    };

}


// ==========================================================
// BATTERY ANIMATION
// ==========================================================

function updateBattery(percent, voltage) {

    setText(

        batteryPercentage,

        percent + "%"

    );

    setText(

        batteryVoltage,

        voltage.toFixed(2)

    );

    batteryBar.style.width = percent + "%";

    const health = getBatteryHealth(percent);

    batteryHealth.textContent = health.text;

    batteryHealth.style.color = health.color;

}


// ==========================================================
// FORMAT TIMESTAMP
// ==========================================================

function formatTimestamp(timestamp) {

    if (

        timestamp == null ||

        timestamp === ""

    ) {

        return "--";

    }

    return timestamp;

}


// ==========================================================
// ELAPSED TIME
// ==========================================================

function timeSince(timestamp){

    if(!timestamp || timestamp==="--") return "--";

    try{

        const parts = timestamp.split(" ");

        const d = parts[0].split("-");

        const t = parts[1].split(":");

        const start = new Date(

            Number(d[2]),

            Number(d[1])-1,

            Number(d[0]),

            Number(t[0]),

            Number(t[1]),

            Number(t[2])

        );

        const diff = Math.floor((new Date()-start)/1000);

        const min = Math.floor(diff/60);

        const sec = diff%60;

        return `${min} min ${sec} sec`;

    }

    catch{

        return "--";

    }

}


// ==========================================================
// ONLINE
// ==========================================================

function setOnline() {

    onlineStatus.textContent = "ONLINE";

    onlineStatus.className = "online";

    onlineDot.style.background = "#10B981";

    onlineDot.style.boxShadow =

        "0 0 10px #10B981";

    if (onlineSince) {

        lastUpdated.textContent =

            timeSince(onlineSince);

    }

}

// ==========================================================
// OFFLINE
// ==========================================================

function setOffline() {

    onlineStatus.textContent = "OFFLINE";

    onlineStatus.className = "offline";

    onlineDot.style.background = "#DC2626";

    onlineDot.style.boxShadow =

        "0 0 10px #DC2626";

    lastUpdated.textContent = "--";

    onlineSince = null;

    walkingSince.textContent = "--";

}


// ==========================================================
// CARD FLASH EFFECT
// ==========================================================

function flashCard(card) {

    if (!card) return;

    card.style.transition = "0.3s";

    card.style.boxShadow =

        "0 0 25px rgba(37,99,235,0.45)";

    setTimeout(() => {

        card.style.boxShadow = "";

    }, 800);

}


// ==========================================================
// GET CARD FROM ELEMENT
// ==========================================================

function getCard(element) {

    return element.closest(

        ".dashboard-card"

    );

}

// ==========================================================
// BATTERY LISTENER
// ==========================================================

onValue(

    batteryRef,

    (snapshot) => {

        if (!snapshot.exists()) {

            return;

        }

        const data = snapshot.val();

        const percentage = Number(

            data.percentage ?? 0

        );

        const voltage = Number(

            data.voltage ?? 0

        );

        const timestamp =

            data.timestamp ?? "--";

        // Update Battery UI

        updateBattery(

            percentage,

            voltage

        );

        // Save latest value

        lastBattery = percentage;

        // Update Last Updated

        setText(

            lastUpdated,

            timestamp

        );

        // Flash Battery Card

        flashCard(

            getCard(

                batteryPercentage

            )

        );

        console.log(

            "[Battery]",

            percentage,

            "%",

            voltage,

            "V"

        );

    }

);

// ==========================================================
// DEVICE LISTENER
// ==========================================================

onValue(

    deviceRef,

    (snapshot) => {

        if (!snapshot.exists()) {

            setOffline();

            return;

        }

        const data = snapshot.val();

        const online = data.online ?? false;

        const lastUpdate =

            data.last_update ?? "--";

        latestHeartbeat = lastUpdate;

        if (online && onlineSince === null) {

            onlineSince = lastUpdate;

        }

        if (online) {

            setOnline();

        }

        else {

            setOffline();

        }

        flashCard(

            getCard(

                onlineStatus

            )

        );

        console.log(

            "[Device]",

            online,

            lastUpdate

        );

    }

);


// ==========================================================
// USER (WALKING) LISTENER
// ==========================================================

onValue(

    userRef,

    (snapshot) => {

        if (!snapshot.exists()) {

            return;

        }

        const data = snapshot.val();

        const status =

            data.status ?? "Standing";

        const since =

            data.since ?? "--";

        walkingStart = since;

        setText(

            walkingStatus,

            status.toUpperCase()

        );

        setText(

            walkingSince,

            timeSince(since)

        );


        // Walking Color

        if (

            status.toLowerCase()

            === "walking"

        ) {

            walkingStatus.className =

                "safe";

        }

        else {

            walkingStatus.className =

                "";

        }

        flashCard(

            getCard(

                walkingStatus

            )

        );

        console.log(

            "[User]",

            status

        );

    }

);

// ==========================================================
// FALL LISTENER
// ==========================================================

onValue(

    fallRef,

    (snapshot) => {

        if (!snapshot.exists()) {

            return;

        }

        const data = snapshot.val();

        const detected =
            data.detected ?? false;

        const lastDetected =
            data.last_detected ?? "Never";

        if (detected) {

            setText(

                fallStatus,

                "FALL DETECTED"

            );

            fallStatus.className =

                "danger";

        }

        else {

            setText(

                fallStatus,

                "NO FALL DETECTED"

            );

            fallStatus.className =

                "safe";

        }

        setText(

            fallLastActivated,

            formatTimestamp(

                lastDetected

            )

        );

        flashCard(

            getCard(

                fallStatus

            )

        );

        console.log(

            "[Fall]",

            detected

        );

    }

);


// ==========================================================
// SOS LISTENER
// ==========================================================

onValue(

    sosRef,

    (snapshot) => {

        if (!snapshot.exists()) {

            return;

        }

        const data = snapshot.val();

        const active =
            data.active ?? false;

        const lastActivated =
            data.last_activated ?? "Never";

        if (active) {

            setText(

                sosStatus,

                "SOS ACTIVATED"

            );

            sosStatus.className =

                "danger";

        }

        else {

            setText(

                sosStatus,

                "NOT ACTIVATED"

            );

            sosStatus.className =

                "safe";

        }

        setText(

            sosLastActivated,

            formatTimestamp(

                lastActivated

            )

        );

        flashCard(

            getCard(

                sosStatus

            )

        );

        console.log(

            "[SOS]",

            active

        );

    }

);


// ==========================================================
// EMERGENCY LISTENER
// ==========================================================

onValue(

    emergencyRef,

    (snapshot) => {

        if (!snapshot.exists()) {

            return;

        }

        const data = snapshot.val();

        const type =
            data.type ?? "--";

        const latitude =
            data.latitude ?? "--";

        const longitude =
            data.longitude ?? "--";

        const timestamp =
            data.timestamp ?? "--";

        setText(

            emergencyType,

            type

        );

        setText(

            emergencyTime,

            timestamp

        );

        setText(

            emergencyLatitude,

            latitude

        );

        setText(

            emergencyLongitude,

            longitude

        );

        // Google Maps Link

        if (

            latitude !== "--" &&

            longitude !== "--"

        ) {

            mapButton.href =

                `https://www.google.com/maps?q=${latitude},${longitude}`;

        }

        else {

            mapButton.href = "#";

        }

        flashCard(

            getCard(

                emergencyType

            )

        );

        console.log(

            "[Emergency]",

            type

        );

    }

);

// ==========================================================
// AI LISTENER
// ==========================================================

onValue(

    aiRef,

    (snapshot) => {

        if (!snapshot.exists()) {

            return;

        }

        const data = snapshot.val();

        const description =
            data.description ??
            "No AI Scan Available";

        const timestamp =
            data.timestamp ??
            "--";

        const image =
            data.image ?? "";

        // --------------------------------------
        // DESCRIPTION
        // --------------------------------------

        setText(

            sceneDescription,

            description

        );

        setText(

            sceneTime,

            timestamp

        );

        // --------------------------------------
        // IMAGE
        // --------------------------------------

        if (image !== "") {

            sceneImage.src =

                "data:image/jpeg;base64," +

                image;

            sceneImage.style.opacity = "0";

            sceneImage.style.display =

                "block";

            setTimeout(() => {

                sceneImage.style.opacity = "1";

            },50);

            imagePlaceholder.style.display =

                "none";

        }

        else {

            sceneImage.style.display =

                "none";

            imagePlaceholder.style.display =

                "flex";

        }

        // --------------------------------------
        // FLASH CARD
        // --------------------------------------

        flashCard(

            getCard(

                sceneDescription

            )

        );

        flashCard(

            getCard(

                sceneImage

            )

        );

        console.log(

            "[AI] Updated"

        );

    }

);

// ==========================================================
// HISTORY LISTENER
// ==========================================================

onValue(

    historyRef,

    (snapshot) => {

        if (!snapshot.exists()) {

            historyContainer.innerHTML =

                "<p>No alerts yet.</p>";

            return;

        }

        const history = [];

        snapshot.forEach(

            (child) => {

                history.push(

                    child.val()

                );

            }

        );

        // Latest first

        history.reverse();

        // Show only latest 5

        const latest = history.slice(0, 5);

        historyContainer.innerHTML = "";

        latest.forEach(

            (item) => {

                const event =

                    item.event ?? "";

                const timestamp =

                    item.timestamp ?? "--";

                let tagClass =

                    "alert-ai";

                if (

                    event.toLowerCase().includes("fall")

                ) {

                    tagClass =

                        "alert-fall";

                }

                else if (

                    event.toLowerCase().includes("sos")

                ) {

                    tagClass =

                        "alert-sos";

                }

                else if (

                    event.toLowerCase().includes("battery")

                ) {

                    tagClass =

                        "alert-battery";

                }

                const card =

                    document.createElement(

                        "div"

                    );

                card.className =

                    "alert-item";

                card.innerHTML =

                `

                <div>

                    <span class="alert-tag ${tagClass}">

                        ${event}

                    </span>

                    <div style="margin-top:8px;font-size:13px;color:#6B7280;">

                        ${timestamp}

                    </div>

                </div>

                `;

                historyContainer.appendChild(

                    card

                );

            }

        );

        flashCard(

            getCard(

                historyContainer

            )

        );

        console.log(

            "[History] Updated"

        );

    }

);

// ==========================================================
// OFFLINE DETECTION
// ==========================================================

setInterval(() => {

    if (!latestHeartbeat) {

        return;

    }

    try {

        const parts = latestHeartbeat.split(" ");

        if (parts.length !== 2) {

            return;

        }

        const date = parts[0].split("-");

        const time = parts[1].split(":");

        const heartbeat = new Date(

            Number(date[2]),

            Number(date[1]) - 1,

            Number(date[0]),

            Number(time[0]),

            Number(time[1]),

            Number(time[2])

        );

        const now = new Date();

        const diff =

            (now - heartbeat) / 1000;

        if (diff > 45) {

            setOffline();

        }

        else {

            setOnline();

        }

    }

    catch (e) {

        console.log(

            "[Heartbeat]",

            e

        );

    }

    if (

        walkingStart &&

        onlineStatus.textContent === "ONLINE"

    ) {

        walkingSince.textContent =

            timeSince(walkingStart);

    }

    if (

        onlineSince &&

        onlineStatus.textContent === "ONLINE"

    ) {

        lastUpdated.textContent =

            timeSince(onlineSince);

    }

}, 1000);


// ==========================================================
// IMAGE CLICK
// ==========================================================

sceneImage.addEventListener(

    "click",

    () => {

        if (sceneImage.src === "") return;

        const newTab = window.open("", "_blank");

        newTab.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>AI Scene Image</title>

                <style>

                    body{

                        margin:0;

                        background:#111;

                        display:flex;

                        justify-content:center;

                        align-items:center;

                        height:100vh;

                    }

                    img{

                        max-width:100%;

                        max-height:100%;

                    }

                </style>

            </head>

            <body>

                <img src="${sceneImage.src}">

            </body>

            </html>

        `);

        newTab.document.close();

    }

);

// ==========================================================
// DASHBOARD STARTUP
// ==========================================================

console.log(

    "==================================="

);

console.log(

    " AI SMART STICK DASHBOARD"

);

console.log(

    " Firebase Connected"

);

console.log(

    " Waiting for Live Data..."

);

console.log(

    "==================================="

);


// ==========================================================
// INITIAL VALUES
// ==========================================================

setOffline();

batteryBar.style.width = "0%";

batteryPercentage.textContent = "--";

batteryVoltage.textContent = "--";

batteryHealth.textContent = "Healthy";

walkingStatus.textContent = "STANDING";

fallStatus.textContent =

"No Fall Detected";

sosStatus.textContent =

"Not Activated";

console.log(

    "[Dashboard Ready]"

);