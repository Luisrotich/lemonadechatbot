const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Serve index.html on root request
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`LemonadeChatBot running on port ${PORT}`);
});