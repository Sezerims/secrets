const express = require("express");
const app = express();

express.urlencoded({extended: true});

app.set("view engine", "ejs");
app.use(express.static("public"));

// GET Home Page
app.get("/", (req, res) => {
    res.render("home");
});

// GET Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

// GET Register Page
app.get("/register", (req, res) => {
    res.render("register");
});

// GET Secrets Page
app.get("/secrets", (req, res) => {
    res.render("secrets");
});

// GET Submit Page
app.get("/submit", (req, res) => {
    res.render("submit");
});

const port = 3000;
app.listen(port, () => {
    console.log("Server is running on port " + port);
});