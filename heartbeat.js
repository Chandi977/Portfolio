// // heartbeat.js
// const https = require("https");

// const URL = "https://charan-portfolio-htvx.onrender.com"; // Replace with your deployed server URL

// setInterval(() => {
//   https
//     .get(URL, (res) => {
//       console.log(`Heartbeat sent: ${res.statusCode}`);
//     })
//     .on("error", (e) => {
//       console.error(`Heartbeat error: ${e.message}`);
//     });
// }, 1000 * 30); // Every 14 minutes (Render/Vercel/Heroku idle timeout is usually 15 min)
