// Set up Express
const express = require("express");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Set up MySQL
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'secrets_db'
});

const key = 'F3229A0B371ED2D9441B830D21A390C3';

// db.connect();

// db.end();

// GET Home Page
app.get("/", (req, res) => {
    res.render("home");
});

// GET Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

// POST Login Page
app.post("/login", (req, res) => {
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    db.query("SELECT AES_DECRYPT(password, UNHEX(?)) AS password FROM users WHERE email = ?", [key, loginEmail], (err, results, fields) => {
        if(!err) {
            if(!results[0]) {
                console.log("User not found!");
                res.redirect("/login");
            } else if(results[0].password.toString() !== loginPassword) {
                console.log("Wrong password!");
                res.redirect("/login");
            } else {
                console.log("User logged in!")
                res.render("secrets");
            }
        } else {
            console.log(err);
        }
    });
});

// GET Register Page
app.get("/register", (req, res) => {
    res.render("register");
});

// POST Register Page
app.post("/register", (req, res) => {
    const registerEmail = req.body.email;
    const registerPassword = req.body.password;
    const registerConfirmPassword = req.body.confirmPassword;

    if(registerPassword !== registerConfirmPassword) {
        console.log("Passwords do not match!");
        res.redirect("/register");
    } else {
        db.query("INSERT INTO users VALUES(?, AES_ENCRYPT(?, UNHEX(?)))", [registerEmail, registerPassword, key], (err, results, fields) => {
            if(!err) {
                console.log("User registered!");
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    }
});

/*
// GET Secrets Page
app.get("/secrets", (req, res) => {
    res.render("secrets");
});
*/

// GET Submit Page
app.get("/submit", (req, res) => {
    res.render("submit");
});

const port = 3000;
app.listen(port, () => {
    console.log("Server is running on port " + port);
});