const bcrypt = require('bcrypt');

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

module.exports = {
  urlDatabase,
  userDatabase,
};