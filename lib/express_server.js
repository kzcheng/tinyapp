// -Constants-
const PORT = 8080;

// -Imports-
const express = require(`express`);
const bodyParser = require(`body-parser`);
const cookieParser = require(`cookie-parser`);

// -App-
const app = express();
app.set(`view engine`, `ejs`); // Set ejs as the view engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// -Temporary URL Database-
const urlDatabase = {
  "b2xVn2": 'http://www.lighthouselabs.ca',
  "9sm5xK": 'http://www.google.com'
};

// -Temporary User Database-
const userDatabase = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// -Useful Functions-
const generateRandomString = function() {
  const length = 6;
  let result = ``;
  let characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const checkDuplicatedEmail = function(email) {
  for (const userID in userDatabase) {
    if (userDatabase[userID].email === email) {
      return true;
    }
  }
  return false;
};

// -Get-
app.get(`/`, (req, res) => {
  res.redirect(`/urls`);
});

app.get(`/index`, (req, res) => {
  res.redirect(`/urls`);
});

app.get(`/urls.json`, (req, res) => {
  res.json(urlDatabase);
});

app.get(`/hello`, (req, res) => {
  res.send(`<html><body>Hello <b>World</b></body></html>\n`);
});

app.get(`/login`, (req, res) => {
  let templateVars = {
    user: userDatabase[req.cookies["user_id"]]
  };
  res.render(`user_login`, templateVars);
});

app.get(`/register`, (req, res) => {
  let templateVars = {
    user: userDatabase[req.cookies["user_id"]]
  };
  res.render(`user_register`, templateVars);
});

app.get(`/urls`, (req, res) => {
  let templateVars = {
    user: userDatabase[req.cookies["user_id"]],
    urls: urlDatabase
  };
  res.render(`urls_index`, templateVars);
});

app.get(`/urls/new`, (req, res) => {
  let templateVars = {
    user: userDatabase[req.cookies["user_id"]]
  };
  res.render(`urls_new`, templateVars);
});

app.get(`/urls/:shortURL`, (req, res) => {
  let templateVars = {
    user: userDatabase[req.cookies["user_id"]],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render(`urls_show`, templateVars);
});

app.get(`/u/:shortURL`, (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// -Post-
app.post(`/login`, (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.sendStatus(400);
    return;
  }
  
  for (const userID in userDatabase) {
    if (userDatabase[userID].email === req.body.email) {
      if (userDatabase[userID].password === req.body.password) {
        // Login success
        res.cookie(`user_id`, userID);
        res.redirect(`/`);
      } else {
        // Password is incorrect
        res.sendStatus(403);
        return;
      }
    }
  }
  // Cannot find email
  res.sendStatus(403);
  return;
});

app.post(`/logout`, (req, res) => {
  res.clearCookie(`user_id`);

  res.redirect(`/`);
});

app.post(`/register`, (req, res) => {
  // Error Catchers
  if (!req.body.email || !req.body.password) {
    res.sendStatus(400);
    return;
  } else if (checkDuplicatedEmail(req.body.email)) {
    res.sendStatus(400);
    return;
  }

  const userID = generateRandomString();
  const user = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  };

  userDatabase[userID] = user;

  res.redirect(`/`);
});

app.post(`/urls`, (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`/urls/${shortURL}`);
});

app.post(`/urls/:shortURL/delete`, (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/`);
});

app.post(`/urls/:shortURL/edit`, (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.editedURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

// Listen
app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}.`);
});
