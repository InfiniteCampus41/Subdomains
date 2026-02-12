const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static assets (css/js/images)
app.use(express.static(path.join(__dirname)));

// Pretty URLs for pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/getting-started", (req, res) => {
  res.sendFile(path.join(__dirname, "getting-started.html"));
});

app.get("/api", (req, res) => {
  res.sendFile(path.join(__dirname, "api.html"));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send(`
    <h1>404</h1>
    <p>Page not found</p>
    <a href="/">Go Home</a>
  `);
});

app.listen(PORT, () => {
  console.log(`GreenDocs running at http://localhost:${PORT}`);
});
