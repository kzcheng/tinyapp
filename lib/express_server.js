// -Constants-
const PORT = 8080;

// -Imports-
const express = require(`express`);
const bodyParser = require(`body-parser`);
const cookieSession = require(`cookie-session`);
const bcrypt = require('bcrypt');

// -App-
const app = express();
app.set(`view engine`, `ejs`); // Set ejs as the view engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'userData',
  keys: ['key1', 'key2']
}));

// -Helper Library-
const {
  generateRandomString,
  getUserByEmail,
  getURLsOfUser,
  checkDuplicatedEmail,
} = require(`./helper`);

// -Temporary URL Database-
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca", userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca", userID: "aJ48lW"
  }
};

// -Temporary User Database-
const userDatabase = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "akira@online.com",
    passwordHashed: bcrypt.hashSync("123", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    passwordHashed: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

// -Testing Gets-
app.get(`/test`, (req, res) => {
  res.render(`test`);
});

app.get(`/urls.json`, (req, res) => {
  res.json(urlDatabase);
});

// -Gets-
app.get(`/`, (req, res) => {
  if (!req.session.userID) {
    res.redirect(`/login`);
  }
  res.redirect(`/urls`);
});

app.get(`/index`, (req, res) => {
  res.redirect(`/urls`);
});

app.get(`/login`, (req, res) => {
  let templateVars = {
    user: userDatabase[req.session.userID]
  };
  res.render(`user_login`, templateVars);
});

app.get(`/register`, (req, res) => {
  let templateVars = {
    user: userDatabase[req.session.userID]
  };
  res.render(`user_register`, templateVars);
});

app.get(`/u/:shortURL`, (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get(`/urls`, (req, res) => {
  let templateVars = {
    user: userDatabase[req.session.userID],
    urls: getURLsOfUser(req.session.userID, urlDatabase)
  };
  res.render(`urls_index`, templateVars);
});

app.get(`/urls/new`, (req, res) => {
  if (!req.session.userID) {
    res.redirect(`/login`);
  }
  
  let templateVars = {
    user: userDatabase[req.session.userID]
  };
  res.render(`urls_new`, templateVars);
});

app.get(`/urls/:shortURL`, (req, res) => {
  if (req.session.userID !== urlDatabase[req.params.shortURL].userID) {
    res.sendStatus(403);
    return;
  }
  let templateVars = {
    user: userDatabase[req.session.userID],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render(`urls_show`, templateVars);
});

// -Post-
app.post(`/login`, (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.sendStatus(400);
    return;
  }

  const user = getUserByEmail(req.body.email, userDatabase);
  if (user && bcrypt.compareSync(req.body.password, user.passwordHashed)) {
    // Login success
    req.session.userID = user.id;
    res.redirect(`/`);
  } else {
    // Password or Email is incorrect
    res.sendStatus(403);
    return;
  }
});

app.post(`/logout`, (req, res) => {
  req.session = null;

  res.redirect(`/`);
});

app.post(`/register`, (req, res) => {
  // Error Catchers
  if (!req.body.email || !req.body.password) {
    res.sendStatus(400);
    return;
  } else if (checkDuplicatedEmail(req.body.email, userDatabase)) {
    res.sendStatus(400);
    return;
  }

  const userID = generateRandomString();
  const user = {
    id: userID,
    email: req.body.email,
    passwordHashed: bcrypt.hashSync(req.body.password, 10)
  };

  userDatabase[userID] = user;

  req.session.userID = userID;
  res.redirect(`/`);
});

app.post(`/urls`, (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = req.session.userID;

  res.redirect(`/urls/${shortURL}`);
});

app.post(`/urls/:shortURL/delete`, (req, res) => {
  if (req.session.userID !== urlDatabase[req.params.shortURL].userID) {
    res.sendStatus(403);
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/`);
});

app.post(`/urls/:shortURL/edit`, (req, res) => {
  if (req.session.userID !== urlDatabase[req.params.shortURL].userID) {
    res.sendStatus(403);
    return;
  }
  urlDatabase[req.params.shortURL].longURL = req.body.editedURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

// Listen
app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}.`);
});
