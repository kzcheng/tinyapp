// -Constants-
const PORT = 8080;

// -Imports-
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

// -App-
const app = express();
app.set("view engine", "ejs"); // Set ejs as the view engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// -Temporary URL Database-
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// -Useful Functions-
const generateRandomString = function() {
  const length = 6;
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// -Get-
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// -Post-
app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);

  res.redirect(`/urls/${shortURL}`);
});

app.post(`/urls/:shortURL/delete`, (req, res) => {
  delete urlDatabase[req.params.shortURL];
  console.log(urlDatabase);
  res.redirect(`/urls`);
});

app.post(`/urls/:shortURL/edit`, (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.editedURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${req.params.shortURL}`);
});

// Listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
